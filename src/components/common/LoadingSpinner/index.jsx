import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * @component LoadingSpinner
 * @description Componente que muestra un indicador de carga circular centrado en la pantalla
 */
const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingSpinner;
