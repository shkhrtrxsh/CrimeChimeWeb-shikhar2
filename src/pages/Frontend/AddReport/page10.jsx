import React, { useState, useEffect } from 'react';
import { Container,useTheme,  Typography, Grid, Box, Divider, LinearProgress, Checkbox, Select, MenuItem } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import NextButton from 'src/components/Button/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from 'src/store/reducers/registerReport';
import { loadGoogleMaps } from 'src/utils/googleMap';
import ProgressBar from 'src/layouts/Report/ProgressBar';
import  API from "src/config/api";

function Page10() {
  const {burglary:checked,burglary_type:value} = useSelector(state=>state.reportRegister.data);
  const dispatch = useDispatch();
  const theme = useTheme();
  const setChecked=(burglary)=>dispatch(setPage({burglary}));
  const setValue=(burglary_type)=>dispatch(setPage({burglary_type}));
  const [burglarydata, setBurglary] = useState([]);


  const handleChange = (value) => {
    setChecked(value);
  };

  useEffect(() => {
    dispatch(setPage({}));

    const fetchCarMakeInfo = async () => {
      const response = await API.get("/burglary");
      const result = response.data;
      setBurglary(result.data.map(data => data));
    }
    fetchCarMakeInfo();
  }, []);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container>
            <Grid container spacing={2} justifyContent="center" sx={{ paddingY: 0 }}>
              <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} mt={5}>
              <Box display="flex" alignItems="center" justifyContent="center">
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
              <Typography variant="h4" align="center" style={{ fontWeight: 'bold', paddingBottom: '5px', fontSize: '24px' }}>
                  Burglary/Shoplifting
                </Typography>
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
                </Box>
                <Typography variant="h2" align="center" style={{ fontWeight: 'bold', paddingBottom: '20px', fontSize: '12px' }}>
                  (i.e. perpetrator(s) entered building)
                </Typography>
                <Typography variant="h2" align="center" style={{ fontWeight: 'bold', paddingBottom: '20px', fontSize: '12px', color: 'red' }}>
                  next page is Robbery, i.e. perpetrator(s) did not enter a building and the crime took place outdoors
                </Typography>
              </Grid>

              <Box sx={{ pl: 8, }}>
                <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '100%' }}>
                  Was burglary or shoplifting involved?
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
                      Attempted Burglary (not shoplifting)
                      <br />
                      <span sx={{ fontSize: 's' }}>goods were not stolen</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==2} value={2} onChange={()=>handleChange(2)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                      Burglary (not shoplifting)
                      <br />
                      <span sx={{ fontSize: 's' }}>goods were stolen</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==3} value={3} onChange={()=>handleChange(3)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                        Attempted Shoplifting
                      <br />
                      <span sx={{ fontSize: 'sm' }}>goods were not stolen</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2 }}>
                    <Checkbox checked={checked==4} value={4} onChange={()=>handleChange(4)} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 5, textAlign: 'left' }}>
                        Shoplifting
                      <br />
                      <span sx={{ fontSize: 'sm' }}>goods were stolen</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', my: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 1, pt: 3, pb: 3, textAlign: { md: 'left' } }}>
                      Select stolen goods item from the list below
                    </Typography>
                    <Select
                      value={value||"other"}
                      onChange={(e)=>setValue(e.target.value)}
                      sx={{ px: 2, width: '50%', borderRadius: 'none', height: '10', }}
                      disabled={checked===0}
                    >
                    {
                      burglarydata.map((option) => (
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
                      <MenuItem value="suitcase">Cash-in-Transit Vehicle</MenuItem>
                      <MenuItem value="copper">Cash</MenuItem>
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

export default Page10;
