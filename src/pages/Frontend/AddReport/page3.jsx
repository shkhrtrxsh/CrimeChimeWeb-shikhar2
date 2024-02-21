import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Divider,
  Select,
  MenuItem,
  Checkbox,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import PeopleIcon from '@mui/icons-material/People';
import NextButton from 'src/components/Button/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { setLock, setPage } from 'src/store/reducers/registerReport';
import { loadGoogleMaps } from 'src/utils/googleMap';
import { jwtDecode } from 'jwt-decode';
import ProgressBar from 'src/layouts/Report/ProgressBar';
// import Perps from "../../../assets/images/perps.png"

function Page3() {
  const { perpetrators, perpetrators_des } = useSelector((state) => state.reportRegister.data);
  const [checked, setChecked] = useState(perpetrators <= 0);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    dispatch(setPage({ [name]: value }));
    if (value && value > 0) {
      setError('');
      dispatch(setLock(false));
    } else {
      setError('*required');
      dispatch(setLock(true));
    }
  };

  const handleChange = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setError('');
      dispatch(setLock(false));
    }
    dispatch(setPage({ perpetrators: checked ? -1 : 1 }));
    setChecked(checked);
    
  };

  const theme = useTheme();
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm">
        <Grid container spacing={2} justifyContent="center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <Grid item xs={10}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
                Perpetrators
              </Typography>
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
            </Box>
            <Typography variant="h2" align="center" style={{ fontWeight: 'bold', paddingBottom: '20px', fontSize: '12px' }}>
              (i.e. persons who committed the crime)
            </Typography>
          </Grid>

          <div style={{paddingTop: '30px', paddingBottom: '30px' }}>
            <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '100%' }}>
              How many perpetrators?
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '20px' }}>
            <Select
  value={perpetrators>=0?perpetrators:''}
  onChange={(event) => {
    const value = event.target.value;
    dispatch(setPage({ perpetrators: value }));
    if (value && value > 0) {
      setError('');
      dispatch(setLock(false));
    } else {
      setError('*required');
      dispatch(setLock(true));
    }
  }}
  disabled={checked}
  error={error ? true : false}
  style={{ marginRight: '8px' }}
>
  {Array.from({ length: 30 }, (_, index) => index + 1).map((number) => (
    <MenuItem key={number} value={number}>
      {number}
    </MenuItem>
  ))}
</Select>



              <Typography style={{ marginLeft: '8px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>OR</Typography>

              <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black', marginLeft: '8px', marginRight: '8px' }} />

              <Typography style={{ display: 'flex', alignItems: 'center' }}>Unknown</Typography>

              <Checkbox checked={checked === true} value={perpetrators} onChange={handleChange} />
            </div>
          </div>

          <Grid item xs={10} style={{ display: 'flex', justifyContent: 'center', paddingTop:'40px', paddingBottom:'40px' }}>
            {/* <img src={Perps} width="70px" height="auto" alt="perpertrator icon"/> */}
          </Grid>
          <Grid item xs={10} style={{ textAlign: 'center', paddingTop: '40px' }}>
            <TextField
              label="Describe perpetrator(s) appearance in as much detail as possible..."
              name="perpetrator_des"
              multiline
              rows={4}
              value={perpetrators_des && jwtDecode(perpetrators_des).perpetrators_des || ''}
              onChange={(e) => dispatch(setPage({ perpetrators_des: e.target.value }))}
              variant="outlined"
              style={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Page3;

