import React, { useState,useEffect } from 'react';
import { Container, Typography,useTheme, Grid, Box, Checkbox, Select, MenuItem } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useDispatch, useSelector } from 'react-redux';
import { setPage} from 'src/store/reducers/registerReport';
import { loadGoogleMaps } from 'src/utils/googleMap';
import ProgressBar from 'src/layouts/Report/ProgressBar';
import  API from "src/config/api";

function Page11() {
  const {robbery:checked,robbery_type:value} = useSelector(state=>state.reportRegister.data);
  
  const dispatch = useDispatch();
  const theme = useTheme();
  const setChecked=(robbery)=>dispatch(setPage({robbery}));
  const setValue=(robbery_type)=>dispatch(setPage({robbery_type}));
  const [robberydata, setrobbery] = useState([]);
  useEffect(() => {
    dispatch(setPage({}));
    
    const fetchCarMakeInfo = async () => {
      const response = await API.get("/robbery");
      const result = response.data;
      setrobbery(result.data.map(data => data));
    }
    fetchCarMakeInfo();
  }, []);

  const handleChange = (v) => {
    setChecked(v);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container>
            <Grid container spacing={2} justifyContent="center" sx={{ paddingY: 0 }}>
              <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} mt={5}>
              <Box display="flex" alignItems="center" justifyContent="center">
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
              <Typography variant="h4" align="center" style={{ fontWeight: 'bold', paddingBottom: '5px', fontSize: '24px' }}>
                  Robbery
                </Typography>
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
                </Box>
                <Typography variant="h2" align="center" style={{ fontWeight: 'bold', paddingBottom: '20px', fontSize: '12px' }}>
                (i.e perpetrators did not enter a building and the crime took place outdoors)
                </Typography>
              </Grid>

              <Box sx={{ pl: 8}}>
                <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '100%' }}>
                  Was robbery involved?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==0} value={0} onChange={()=>handleChange(0)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                      Does not apply
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==1} value={1} onChange={()=>handleChange(1)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                    Attempted Robbery
                      <br />
                      <span sx={{ fontSize: 'sm' }}>(goods were not stolen)</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==2} value={2} onChange={()=>handleChange(2)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                      Robbery
                      <br />
                      <span sx={{ fontSize: 'sm' }}>(goods were stolen)</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', my: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 1, pt: 3, pb: 3, textAlign: { md: 'left' } }}>
                      Select stolen goods item from the list below
                    </Typography>
                    <Select
                      value={value}
                      onChange={(e)=>setValue(e.target.value)}
                      sx={{ px: 2, width: '50%', borderRadius: 'none', height: '10' }}
                      disabled={checked===0}
                    >
                      {
                        robberydata.map((option) => (
                          <MenuItem value={option}>{option}</MenuItem>
                        ))
                      }
                      {/* <MenuItem value="bicycle">Bicycle</MenuItem>
                      <MenuItem value="handbag">Handbag</MenuItem>
                      <MenuItem value="watch">Watch</MenuItem>
                      <MenuItem value="jewellery">Jewellery</MenuItem>
                      <MenuItem value="phone">Phone</MenuItem>
                      <MenuItem value="credit/debit/bank-card">Credit/Debit/Bank Card</MenuItem>
                      <MenuItem value="wallet/cash">Wallet/Purse</MenuItem>
                      <MenuItem value="passport">Passport</MenuItem>
                      <MenuItem value="ID-document">ID Document</MenuItem>
                      <MenuItem value="general-documents">General Documents</MenuItem>
                      <MenuItem value="backpack">Backpack</MenuItem>
                      <MenuItem value="suitcase">Suitcase</MenuItem>
                      <MenuItem value="copper">Cash</MenuItem>
                      <MenuItem value="copper">Cash-in-transit vehicle</MenuItem>
                      <MenuItem value="other">Other</MenuItem> */}
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Container>
    </LocalizationProvider>
  );
}

export default Page11;