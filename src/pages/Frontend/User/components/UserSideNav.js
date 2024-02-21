import * as React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function UserSideName() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid item xs={12} md={3} sx={{
      background: "#fff",
      borderRight: isMobile ? 'none' : '1px solid #ddd',
      height: isMobile ? 'auto' : 'calc( 100vh - 65px )',
      [theme.breakpoints.down('md')]: {
        borderRight: 'none',
      },
    }}>
      <Paper sx={{ maxWidth: '100%' }} id="user-side">
        <MenuList>
          <MenuItem component={Link} to="/profile">
            <ListItemIcon sx={{}}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>User Profile</ListItemText>
          </MenuItem>
          <MenuItem component={Link} to="/my-report">
            <ListItemIcon sx={{}}>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Reports</ListItemText>
          </MenuItem>
          <MenuItem component={Link} to="/my-addresses">
            <ListItemIcon sx={{}}>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Crime Tracker</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </Grid>
  );
}
