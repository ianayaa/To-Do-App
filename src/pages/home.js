import React, { useState } from "react";
import TaskCard from "../components/tasks/TaskCard";
import TaskSummary from "../components/tasks/taskSummary";
import AddTask from "../components/tasks/AddTask";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import useAddTask from "../hooks/tasks/useAddTask";
import useDeleteTask from "../hooks/tasks/useDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faFilter, faTags, faXmark } from "@fortawesome/free-solid-svg-icons";
import useUserData from "../hooks/user/useUserData";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  Divider,
  Tooltip,
  Fade,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const Home = () => {
  const [user] = useAuthState(auth);
  const { userData, loading } = useUserData();
  const { tasks, completedCount, pendingCount, overdueCount, addTaskToList, updateTask } =
    useTasks(db, user);
  const { addTask } = useAddTask(db, user, addTaskToList);
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
      
      if (taskTime === todayTime) {
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: '#2C2C2C',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          ) : (
            <>Hola, {displayName.split(" ").slice(0, 2).join(" ")}</>
          )}
        </Typography>
        <Typography 
          variant="subtitle1" 
          gutterBottom
          sx={{ 
            color: '#424242',
            fontSize: { xs: '0.875rem', sm: '1rem' }
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
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 3
            }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#FFC247'
                }}
              >
                Mis Tareas
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  alignItems: 'center',
                  justifyContent: 'flex-end'
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
              gap: 3,
            }}>
              {/* Columna Hoy */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Hoy
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
                          textAlign: 'center'
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
                    mb: 2, 
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Mañana
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
                          textAlign: 'center'
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
                    mb: 2, 
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Próximos días
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
                          textAlign: 'center'
                        }}
                      >
                        No hay tareas programadas
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
                    mb: 2, 
                    color: '#FFC247',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Sin fecha asignada
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
