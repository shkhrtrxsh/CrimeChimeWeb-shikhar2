import { useEffect } from 'react';
import {
  Typography,
  Grid,
  useTheme,
  Box,

  Button,

  useMediaQuery,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import current from '../../../assets/images/current.png';
import duplicateImage from '../../../assets/images/duplicate.png';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';


import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { getNearbyCrimes2 } from 'src/store/api/registerReport';
import { clearNearbyReports, setDuplicate, setMarker } from 'src/store/reducers/registerReport';
import { useNavigate } from 'react-router-dom';
import { CrimeDetails } from 'src/utils/crimeDetails';

const vehicle_theft_choices = ["hijacking", "attempted hijacking", "vehicle theft", "attempted vehicle theft", "does not apply"];
const various_choices = ["crime occured at ATM", "drug-related crime", "gang-related crime", "Arson was involed", "Vandalism was involed", "social unrest"]

export const SuccessDialog = ({open,handleClose})=>{
  return(
    <Dialog
        open={open===1||open===2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {open===1?"Success":"Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {open===1?"Thanks for confirming the crime. Crime has been recorded.":"Error Submitting the Report.Please Try Again."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
  )
}

function Duplicate({mapRef,viewCrime=false,setSelectActive}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {nearbyData:values=[],data:regData,loading,duplicate} = useSelector(state=>state.reportRegister);
  const {index,open} = duplicate;
  const {latitude:lat,longitude:long} = regData;
  const {latitude,longitude,report_images}=values[index]||{};
  const mediaData = (report_images&&report_images[0])?report_images[0].path:"No media available";
const theme = useTheme();
const doFunc=()=>{
  setSelectActive(4);
}
  
  useEffect(()=>{
    dispatch(setMarker({latitude,longitude}));
  },[latitude,longitude,index])

  useEffect(()=>{
    dispatch(getNearbyCrimes2({latitude:lat,longitude:long,doFunc}));
    dispatch(setDuplicate({index:0}))
  },[]);

  useEffect(() => {
    dispatch(clearNearbyReports());
    dispatch(getNearbyCrimes2({latitude:lat,longitude:long,doFunc}));
    if(mapRef.current){
      const mapElement = mapRef.current;
      mapElement.marker=null;
    }
  }, [lat,long,mapRef]);

  useEffect(() => {
    if(values[index]){  
      const interval = setInterval(() => {
        if(mapRef.current){
          const mapElement = mapRef.current;
          if (mapElement.map) {
            clearInterval(interval);
            if(latitude&&longitude){  
              const marker = new window.google.maps.Marker({
                position: { lng:Number(longitude),
                  lat:Number(latitude) },
                map: mapElement.map,
                title: "Crime Location Marker 2",
                icon:duplicate,
              });
              //if (mapElement.marker) mapElement.marker.setMap(null);
              mapElement.marker = marker;
            }
          }
        }
      }, 100);
    }
  }, [latitude, longitude,mapRef]);

  const data = values[index]&& CrimeDetails(values,index,vehicle_theft_choices,various_choices,mediaData);
  
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));
  
  function isImage(url) {
    const imageExtensions = ['.apng', '.bmp', '.gif', '.ico', '.cur', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.tif', '.tiff', '.webp'];
    const lowerCaseUrl = url.toLowerCase();
    return imageExtensions.some(extension => lowerCaseUrl.endsWith(extension));
  }
  
  function isVideo(url) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(extension => lowerCaseUrl.endsWith(extension));
  }
  
  const handleClose=(open)=>{
    const prev = open;
    dispatch(setDuplicate({open:0}))
    if(prev===1){
      navigate("/");
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SuccessDialog open={open} handleClose = {()=>handleClose(open)}/>
        <Box sx={{mt:5,pl:5,h:"100%"}}>
          <Grid container spacing={2} justifyContent="center" alignItems='center' sx={{ textAlign: 'center' }}>
            <Grid item xs={10}>
              <Box sx={{display:"flex",width:"100%",justifyContent:"center", alignItems:'center'}}>
              <Box display="flex" alignItems="center" justifyContent="center" paddingTop="10px">
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
                  {viewCrime?"View Crimes":"Possible Duplicate"}
                </Typography>
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
            </Box>
                {viewCrime&&
                  <Box component={"button"} sx={{display:"flex",width:"100%",justifyContent:"center",border:"none"}}>
                  </Box>
                }

              </Box>
            </Grid>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: '15px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start',alignItems:"center" }}>
                  <img src={current} alt="imgg" style={{ height:'17px'}} />
                  <Box>
                    <Typography align="left" sx={{ fontWeight: 'normal', paddingBottom: '10px', paddingTop: '10px', fontSize: '12px' }}>
                      Your report's location on the map
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start',alignItems:"center" }}>
                  <img src={duplicateImage} alt="imgg" style={{ height:"17px"}} />
                  <Box>
                    <Typography align="left" sx={{ fontWeight: 'normal', paddingBottom: '10px', paddingTop: '10px', fontSize: '12px' }}>
                      Possible duplicate report's location on the map
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {(()=>{
                if(loading){
                  return (
                    <Box sx={{width:"100%",display:"flex",justifyContent:"center",mt:4}}>
                      <CircularProgress/>
                    </Box>
                  )
                }else{
                  return (
                  values[index]?
                  <Box>
                      <Box>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            {data.map((row, index) => (
                              row.secondCol!==null&&<TableRow key={index}>
                                <TableCell>{row.firstCol}</TableCell>
                                <TableCell>
                                  {row.firstCol === 'Media:' && mediaData ? (
                                    isImage(mediaData) ? (
                                      <img src={process.env.REACT_APP_API_URL+"/"+mediaData} alt="media" style={{ width: '100%', height: 'auto' }} />
                                    ) : isVideo(mediaData) ? (
                                      <video src={process.env.REACT_APP_API_URL+"/"+mediaData} controls style={{ width: '100%', height: 'auto' }} />
                                    ) : (
                                      'No media available'
                                    )
                                  ) : (
                                    row.secondCol
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Box sx={{ paddingTop: '5px',mb:10 }}>
                      <Typography variant="h1" align="center" style={{ fontWeight: 'bold', paddingBottom: '10px', fontSize: '17px' }}>
                        Is this your crime?
                      </Typography>
                    </Box>
                  </Box>
                  :
                  <Typography align="center">No crimes found!</Typography>
                  );
                }
              })()}
              
            </Box>
          </Grid>
        </Box>
    </LocalizationProvider>
  );
}

export default Duplicate;
