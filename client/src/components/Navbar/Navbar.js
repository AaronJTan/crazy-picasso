import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1, mb: 1 }}>
      <AppBar position="static" color='transparent'>
        <Toolbar sx={{ backgroundColor: "white" }}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography textAlign={'left'} variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} to="/" style={{ textDecoration: "none", color: "black" }}>
              Crazy Picasso
            </Link>
          </Typography>
          <Link component={RouterLink} to="/auth/signup" style={{ textDecoration: "none", color: "black" }}>
            <Button color="inherit">Sign up</Button>
          </Link>
          <Link component={RouterLink} to="/auth/signin" style={{ textDecoration: "none", color: "black" }}>
            <Button color="inherit">Log In</Button>
          </Link>
          {/* <Button color="inherit">Login with Google</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
