import { Container, Typography,useTheme, Grid, Box, Checkbox } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import bribe from '../../../assets/images/bribe.png';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from 'src/layouts/Report/ProgressBar';
import { setPage } from 'src/store/reducers/registerReport';

const Page13 = () => {
  const {bribery:checked} = useSelector(state=>state.reportRegister.data);
  const dispatch = useDispatch();
  const theme = useTheme();
  const setChecked = (bribery)=> dispatch(setPage({bribery}))
  
  const handleChange = (event) => {
    setChecked(Number(event.target.value));
  };
  const handleChange1 = (event) => {
    setChecked(Number(event.target.value));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container>
            <Grid container spacing={2} justifyContent="center" sx={{ paddingY: 0 }} mt={5}>
              <Grid item xs={10} className="pt-5">
              <Box display="flex" alignItems="center" justifyContent="center">
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
              <Typography variant="h1" align="center" style={{ fontWeight: 'bold', paddingBottom: '5px', fontSize: '24px' }}>
                  Bribery
                </Typography>
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '20px' }}>
                  <img src={bribe} alt="Vehicle Theft" style={{ height: '100px' }} />
                </Box>
              </Grid>

              <Grid item xs={8} >
                <Box sx={{ display: 'flex', flexDirection: 'column' , paddingTop:'5%' }}>
                <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '16px' }}>
                  Was bribery involved?
                </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
                    <Checkbox checked={checked==0} value={0} onChange={handleChange} />
                    <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
                      Does not apply
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
                    <Checkbox checked={checked==1} value={1} onChange={handleChange} />
                    <Typography variant="h6" style={{ fontSize: '18px', fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      Bribe requested by police officer
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
                    <Checkbox checked={checked==2} value={2} onChange={handleChange} />
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      Bribe requested by civil servant
                      <br />
                      <span style={{ textAlign: 'left', fontSize: '0.8rem' }}>(not a police officer)</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
                    <Checkbox checked={checked==3} value={3} onChange={handleChange} />
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      Bribe requested by politician
                    </Typography>
                  </Box>
                  <Box style={{ marginBottom:'0px',flexDirection: 'row', textAlign:'center', alignItems: 'center', my: 2, pl: 2 }}>
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
                        Was a bribe paid?
                    </Typography>
                    </Box>
                  <Box style={{ display: 'flex', marginTop:'0px',flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
                    <Checkbox checked={checked==0} value={0} onChange={handleChange1} />
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      Unknown
                    </Typography>
                    <Checkbox checked={checked==1} value={1} onChange={handleChange1} />
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      Yes
                    </Typography>
                    <Checkbox checked={checked==2} value={2} onChange={handleChange1} />
                    <Typography variant="h6" style={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
                      No
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
    </LocalizationProvider>
  );
};

export default Page13;
