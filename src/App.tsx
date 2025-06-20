import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import CollectionsIcon from '@mui/icons-material/Collections';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { theme } from './theme';
import { Journal } from './pages/Journal';
import { Gallery } from './pages/Gallery';
import { Dashboard } from './pages/Dashboard';

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🐼 Autana
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<BookIcon />}
          sx={{
            backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          Journal
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/gallery"
          startIcon={<CollectionsIcon />}
          sx={{
            backgroundColor: location.pathname === '/gallery' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          Gallery
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/dashboard"
          startIcon={<DashboardIcon />}
          sx={{
            backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box sx={{ flexGrow: 1, backgroundColor: '#0a0a0a' }}>
            <Routes>
              <Route path="/" element={<Journal />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
          <Box component="footer" sx={{ py: 3, textAlign: 'center', backgroundColor: '#1a1a1a' }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 Autana - Transform consciousness into digital art
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;