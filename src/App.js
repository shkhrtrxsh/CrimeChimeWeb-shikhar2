// routes
import Router from './routes';
import { useState } from 'react';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {useJsApiLoader } from '@react-google-maps/api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './style.css'
import { StyledEngineProvider } from '@mui/material';

// ----------------------------------------------------------------------

export default function App() {

  const [libraries] = useState(['places'])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  })

    if (!isLoaded) {
        return (
          <Box sx={{ display: 'flex', marginTop: '40vh' }}>
            <CircularProgress sx={{ margin:'auto'}} />
          </Box>
        )
    }

  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <ToastContainer />
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
    </StyledEngineProvider>
  );
}
