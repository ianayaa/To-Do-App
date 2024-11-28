import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Grid, Container, Typography, Paper, TextField, InputAdornment, IconButton, Menu, Divider, Tooltip, Fade, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import TaskCard from "../../components/tasks/TaskCard.jsx";
import TaskSummary from "../../components/tasks/taskSummary.jsx";
import AddTask from "../../components/tasks/AddTask.jsx";
import useTasks from "../../hooks/tasks/useTasks";
import { auth, db } from "../../config/firebase";
import useAddTask from "../../hooks/tasks/useAddTask";
import useDeleteTask from "../../hooks/tasks/useDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faFilter, faTags, faXmark } from "@fortawesome/free-solid-svg-icons";
import useUserData from "../../hooks/user/useUserData";

const Home = () => {
  const [user] = useAuthState(auth);
  const { userData, loading: userLoading } = useUserData();
  const { tasks, completedCount, pendingCount, overdueCount } = useTasks(db, user);
  const { addTask } = useAddTask(db, user);
  const { deleteTask } = useDeleteTask(db);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todas");
  const [anchorEl, setAnchorEl] = useState(null);
  const displayName = userData?.name || user?.displayName || "Usuario";

  const handleOpenFilters = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro por texto
    const matchesSearch = 
      task.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    let matchesStatus = true;
    if (statusFilter !== "todos") {
      matchesStatus = statusFilter === "completadas" ? 
        task.estado === "Completada" : 
        task.estado === "Pendiente";
    }

    // Filtro por fecha
    let matchesDate = true;
    if (dateFilter !== "todas") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = task.dueDate?.toDate();
      if (taskDate) {
        taskDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case "hoy":
            matchesDate = taskDate.getTime() === today.getTime();
            break;
          case "semana": {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDate = taskDate >= weekStart && taskDate <= weekEnd;
            break;
          }
          case "mes":
            matchesDate = 
              taskDate.getMonth() === today.getMonth() &&
              taskDate.getFullYear() === today.getFullYear();
            break;
          case "vencidas":
            matchesDate = taskDate < today && task.estado !== "Completada";
            break;
          default:
            matchesDate = true;
        }
      } else {
        // Si la tarea no tiene fecha y estamos filtrando por fecha, no la mostramos
        matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredAndGroupedTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const groups = {
      vencidas: [],
      hoy: [],
      manana: [],
      proximos: [],
      sinFecha: []
    };
    
    filteredTasks.forEach(task => {
      if (!task.dueDate) {
        groups.sinFecha.push(task);
        return;
      }
      
      const taskDate = task.dueDate.toDate();
      taskDate.setHours(0, 0, 0, 0);
      
      const taskTime = taskDate.getTime();
      const todayTime = today.getTime();
      const tomorrowTime = tomorrow.getTime();
      
      if (taskTime < todayTime && task.estado !== "Completada") {
        groups.vencidas.push(task);
      } else if (taskTime === todayTime) {
        groups.hoy.push(task);
      } else if (taskTime === tomorrowTime) {
        groups.manana.push(task);
      } else if (taskTime > todayTime) {
        groups.proximos.push(task);
      }
    });
    
    return groups;
  };

  const groups = filteredAndGroupedTasks();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: 0 }}>
      <Box sx={{ mb: { xs: 2, sm: 4 }, pl: 0 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: '800',
            color: '#25283D',
            fontSize: { xs: '1.75rem', sm: '2rem' },
            textAlign: 'left',
            width: '100%',
            pl: 0,
            ml: 0,
            mb: 1,
            letterSpacing: '-0.5px'
          }}
        >
          {userLoading ? (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          ) : (
            <>¡Hola, {displayName}!</>
          )}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: '500',
            mb: 4,
            opacity: 0.9,
            pl: 0
          }}
        >
          Aquí está el resumen de tus tareas
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12}>
          <TaskSummary
            completedCount={completedCount}
            pendingCount={pendingCount}
            overdueCount={overdueCount}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3 },
              backgroundColor: '#25283D',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FFC247 0%, #FFB014 100%)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 4,
              pb: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#FFC247',
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    letterSpacing: '-0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40%',
                      height: '2px',
                      background: 'linear-gradient(90deg, #FFC247 0%, transparent 100%)',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Mis Tareas
                </Typography>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                    border: '1px solid rgba(255, 194, 71, 0.2)',
                  }}
                >
                  <Typography
                    sx={{ 
                      fontSize: '0.875rem',
                      color: 'rgba(255, 194, 71, 0.8)',
                      fontWeight: 500
                    }}
                  >
                    {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 2,
                  padding: '8px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {isSearchOpen ? (
                    <Fade in={isSearchOpen}>
                      <TextField
                        size="small"
                        placeholder="Buscar tareas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        onBlur={() => {
                          if (!searchTerm) {
                            setIsSearchOpen(false);
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesomeIcon 
                                icon={faSearch} 
                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: searchTerm && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSearchTerm("");
                                  setIsSearchOpen(false);
                                }}
                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          width: '250px',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 194, 71, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#FFC247',
                            },
                          },
                          '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)',
                          },
                        }}
                      />
                    </Fade>
                  ) : (
                    <Tooltip title="Buscar tareas">
                      <IconButton 
                        onClick={() => setIsSearchOpen(true)}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: '#FFC247',
                            backgroundColor: 'rgba(255, 194, 71, 0.1)',
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Tooltip title="Filtrar tareas">
                  <IconButton
                    onClick={handleOpenFilters}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: '#FFC247',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseFilters}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1,
                      backgroundColor: '#25283D',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 194, 71, 0.1)',
                        },
                      },
                    },
                  }}
                >
                  <Box sx={{ p: 2, minWidth: 250 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: '#FFC247',
                        mb: 2,
                        fontWeight: 600 
                      }}
                    >
                      Filtrar tareas
                    </Typography>
                    
                    <FormControl 
                      fullWidth 
                      size="small" 
                      sx={{ mb: 2 }}
                    >
                      <InputLabel 
                        id="status-filter-label"
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#FFC247'
                          }
                        }}
                      >
                        Estado
                      </InputLabel>
                      <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Estado"
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          handleCloseFilters();
                        }}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 194, 71, 0.5)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFC247',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      >
                        <MenuItem value="todos">Todas las tareas</MenuItem>
                        <MenuItem value="pendientes">Pendientes</MenuItem>
                        <MenuItem value="completadas">Completadas</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl 
                      fullWidth 
                      size="small"
                    >
                      <InputLabel 
                        id="date-filter-label"
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#FFC247'
                          }
                        }}
                      >
                        Fecha
                      </InputLabel>
                      <Select
                        labelId="date-filter-label"
                        value={dateFilter}
                        label="Fecha"
                        onChange={(e) => {
                          setDateFilter(e.target.value);
                          handleCloseFilters();
                        }}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 194, 71, 0.5)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFC247',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      >
                        <MenuItem value="todas">Todas las fechas</MenuItem>
                        <MenuItem value="hoy">Hoy</MenuItem>
                        <MenuItem value="semana">Esta semana</MenuItem>
                        <MenuItem value="mes">Este mes</MenuItem>
                        <MenuItem value="vencidas">Vencidas</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Menu>

                <Tooltip title="Agregar tarea">
                  <IconButton
                    onClick={() => setOpenAddTask(true)}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: '#FFC247',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Grid de columnas de tareas */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              },
              gap: 4,
              '& > *': {
                minWidth: '280px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 2,
                padding: 2,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                height: 'fit-content',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                }
              }
            }}>
              {/* Columna Vencidas */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: '#FF6B6B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(255, 107, 107, 0.3) 0%, transparent 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FF6B6B',
                      boxShadow: '0 0 8px rgba(255, 107, 107, 0.5)',
                    }} 
                  />
                  Vencidas
                  {groups.vencidas.length > 0 && (
                    <Box
                      sx={{
                        ml: 'auto',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        color: '#FF6B6B',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        minWidth: 20,
                        textAlign: 'center',
                      }}
                    >
                      {groups.vencidas.length}
                    </Box>
                  )}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: 200,
                  }}
                >
                  {groups.vencidas.length > 0 ? (
                    groups.vencidas.map((task) => (
                      <Fade in key={task.id} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                          />
                        </Box>
                      </Fade>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%',
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }}
                      >
                        No hay tareas vencidas
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Columna Hoy */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(255, 194, 71, 0.3) 0%, transparent 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FFC247',
                      boxShadow: '0 0 8px rgba(255, 194, 71, 0.5)',
                    }} 
                  />
                  Hoy
                  {groups.hoy.length > 0 && (
                    <Box
                      sx={{
                        ml: 'auto',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                        color: '#FFC247',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        minWidth: 20,
                        textAlign: 'center',
                      }}
                    >
                      {groups.hoy.length}
                    </Box>
                  )}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: 200,
                  }}
                >
                  {groups.hoy.length > 0 ? (
                    groups.hoy.map((task) => (
                      <Fade in key={task.id} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                          />
                        </Box>
                      </Fade>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%',
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }}
                      >
                        No hay tareas para hoy
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Columna Mañana */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(255, 194, 71, 0.3) 0%, transparent 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FFC247',
                      boxShadow: '0 0 8px rgba(255, 194, 71, 0.5)',
                    }} 
                  />
                  Mañana
                  {groups.manana.length > 0 && (
                    <Box
                      sx={{
                        ml: 'auto',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                        color: '#FFC247',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        minWidth: 20,
                        textAlign: 'center',
                      }}
                    >
                      {groups.manana.length}
                    </Box>
                  )}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: 200,
                  }}
                >
                  {groups.manana.length > 0 ? (
                    groups.manana.map((task) => (
                      <Fade in key={task.id} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                          />
                        </Box>
                      </Fade>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%',
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }}
                      >
                        No hay tareas para mañana
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Columna Próximos días */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(255, 194, 71, 0.3) 0%, transparent 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FFC247',
                      boxShadow: '0 0 8px rgba(255, 194, 71, 0.5)',
                    }} 
                  />
                  Próximos días
                  {groups.proximos.length > 0 && (
                    <Box
                      sx={{
                        ml: 'auto',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                        color: '#FFC247',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        minWidth: 20,
                        textAlign: 'center',
                      }}
                    >
                      {groups.proximos.length}
                    </Box>
                  )}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: 200,
                  }}
                >
                  {groups.proximos.length > 0 ? (
                    groups.proximos.map((task) => (
                      <Fade in key={task.id} timeout={300}>
                        <Box>
                          <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                          />
                        </Box>
                      </Fade>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%',
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }}
                      >
                        No hay tareas próximas
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Sección Sin fecha al final */}
            {groups.sinFecha.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(255, 194, 71, 0.3) 0%, transparent 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FFC247',
                      boxShadow: '0 0 8px rgba(255, 194, 71, 0.5)',
                    }} 
                  />
                  Sin fecha asignada
                  {groups.sinFecha.length > 0 && (
                    <Box
                      sx={{
                        ml: 'auto',
                        backgroundColor: 'rgba(255, 194, 71, 0.1)',
                        color: '#FFC247',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        minWidth: 20,
                        textAlign: 'center',
                      }}
                    >
                      {groups.sinFecha.length}
                    </Box>
                  )}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                    },
                  }}
                >
                  {groups.sinFecha.map((task) => (
                    <Fade in key={task.id} timeout={300}>
                      <Box>
                        <TaskCard
                          task={task}
                          deleteTask={deleteTask}
                        />
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <AddTask
        open={openAddTask}
        addTask={addTask}
        handleClose={() => setOpenAddTask(false)}
      />
    </Container>
  );
};

export default Home;
