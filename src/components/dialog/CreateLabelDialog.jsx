import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  Tooltip,
  Slide
} from '@mui/material';
import { ChromePicker } from 'react-color';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AlarmIcon from '@mui/icons-material/Alarm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookIcon from '@mui/icons-material/Book';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import WorkIcon from '@mui/icons-material/Work';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const availableIcons = [
  { icon: AccessTimeIcon, name: 'Reloj' },
  { icon: AccountBalanceIcon, name: 'Banco' },
  { icon: AccountCircleIcon, name: 'Usuario' },
  { icon: AddShoppingCartIcon, name: 'Carrito' },
  { icon: AlarmIcon, name: 'Alarma' },
  { icon: AttachMoneyIcon, name: 'Dinero' },
  { icon: BookIcon, name: 'Libro' },
  { icon: BusinessIcon, name: 'Negocio' },
  { icon: CheckCircleIcon, name: 'Completado' },
  { icon: DirectionsRunIcon, name: 'Ejercicio' },
  { icon: EventIcon, name: 'Evento' },
  { icon: FavoriteIcon, name: 'Favorito' },
  { icon: FitnessCenterIcon, name: 'Gimnasio' },
  { icon: HomeIcon, name: 'Casa' },
  { icon: LocalHospitalIcon, name: 'Salud' },
  { icon: NotificationsActiveIcon, name: 'Notificación' },
  { icon: PriorityHighIcon, name: 'Prioridad' },
  { icon: SchoolIcon, name: 'Escuela' },
  { icon: ShoppingBasketIcon, name: 'Compras' },
  { icon: WorkIcon, name: 'Trabajo' },
];

const CreateLabelDialog = ({ open, onClose, onSave }) => {
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1976d2');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSave = () => {
    if (!labelName.trim() || !selectedIcon) {
      return;
    }

    const newLabel = {
      value: labelName.trim(),
      label: labelName.trim(),
      icon: React.createElement(selectedIcon, { sx: { color: selectedColor } }),
      color: selectedColor
    };

    onSave(newLabel);
    handleClose();
  };

  const handleClose = () => {
    setLabelName('');
    setSelectedColor('#1976d2');
    setShowColorPicker(false);
    setSelectedIcon(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: '#25283D',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Nueva Etiqueta
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ 
        py: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de la etiqueta"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FFC247',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFC247',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FFC247',
              },
            }}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Selecciona un ícono
            </Typography>
            <Grid container spacing={1} sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {availableIcons.map((iconData, index) => {
                const Icon = iconData.icon;
                return (
                  <Grid item key={index}>
                    <Tooltip title={iconData.name}>
                      <IconButton
                        onClick={() => setSelectedIcon(iconData.icon)}
                        sx={{
                          color: selectedIcon === iconData.icon ? selectedColor : 'rgba(255, 255, 255, 0.7)',
                          backgroundColor: selectedIcon === iconData.icon ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <Icon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Color de la etiqueta
            </Typography>
            <Box
              onClick={() => setShowColorPicker(!showColorPicker)}
              sx={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                backgroundColor: selectedColor,
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                },
              }}
            />
            {showColorPicker && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  mt: 1
                }}
              >
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setShowColorPicker(false)}
                />
                <ChromePicker
                  color={selectedColor}
                  onChange={(color) => setSelectedColor(color.hex)}
                  onChangeComplete={(color) => {
                    setSelectedColor(color.hex);
                    setShowColorPicker(false);
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Typography variant="subtitle1" gutterBottom>
              Vista previa
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: selectedColor,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '15px',
                gap: 1
              }}
            >
              {selectedIcon && React.createElement(selectedIcon)}
              <span>{labelName || 'Nombre de la etiqueta'}</span>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!labelName.trim() || !selectedIcon}
          sx={{
            backgroundColor: '#FFC247',
            color: '#25283D',
            '&:hover': {
              backgroundColor: '#FFD47F',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 194, 71, 0.3)',
              color: 'rgba(37, 40, 61, 0.3)',
            }
          }}
        >
          Crear Etiqueta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelDialog;
