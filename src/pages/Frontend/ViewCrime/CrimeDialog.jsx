import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,

  Box,

  Button,

  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import duplicate from '../../../assets/images/duplicate.png';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setCrimeIndex, setEdit, setNearbyReports, setPage } from 'src/store/reducers/registerReport';
import { useNavigate } from 'react-router-dom';


import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { setMarker } from 'src/store/reducers/registerReport';
import { CrimeDetails } from 'src/utils/crimeDetails';
import API from 'src/config/api';
import { setDate } from 'date-fns';
const vehicle_theft_choices = ["hijacking", "attempted hijacking", "vehicle theft", "attempted vehicle theft", "does not apply"];
const various_choices = ["I believe this crime to be drug-related","Crime occurred at ATM","Does not apply","I believe this crime to be gang-related" ,"Arson was involved","Vandalism was involved" ,"Social an unrest","Bombs were involved"]

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
            {open===1?"Report Submitted Successfully":"Error Submitting the Report"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
  )
}

function CrimeDialog({mapRef,index=0,onClose}) {
  const[data, setDataa]= useState();
  const dispatch = useDispatch();
  const [fetchData,setData] = useState('')
  const [reportType,setReportType] = useState(true)
  const {nearbyData:values=[],data:regData,lock,loading} = useSelector(state=>state.reportRegister);
  const {latitude:lat,longitude:long} = regData;
  const [open, setOpen] = useState(0)
  const {id,date_time,latitude,longitude,report_images}=values[index]||{};
  const mediaData = (report_images)?report_images[0]?.path:"No media available";
  const [buttonShow,setButtonShow] = useState(false)
  const [count,setCount] = useState('')
  useEffect(()=>{
    dispatch(setMarker({latitude,longitude}));
  },[latitude,longitude,index])

  useEffect(() => {
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

  

  const theme = useTheme();
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
  const navigate = useNavigate();
  const [permission,setPermission] = useState('')
  const [profile,setProfile] = useState('')
  const getPermissionHandler = async () => {
    const response = await API.get(`/reportPermission`)
    setPermission(response.data.data)
  }
  const getProfile = async () => {
    const response = await API.get(`/getProfile`)
    setProfile(response.data.data)
    // if(response) return response.data.data
  }
  
  useEffect(()=>{
    getPermissionHandler();
    getReport();
    getProfile();
    setDataa(CrimeDetails(values,index,vehicle_theft_choices,various_choices,mediaData,reportType));
  },[])
  
  const handleEdit = (report)=>{
    let newReport = {...report,crime:null,specific_crime:null}; 
    const report_image=newReport.report_image
    newReport.files=newReport.fileName=(process.env.REACT_APP_API_URL+"/"+report_image?.path) || null; 
    newReport.report_image=null;
    //remove null values from newReport
    const keyList = Object.keys(newReport);
    keyList.forEach((key)=>{
        if((newReport[key]==null)){
          delete newReport.key;
        }
    })                                            
    dispatch(setEdit(true));
    dispatch(setPage(newReport));
    navigate("/report/add");
  }
  
  const reportTypeHandler = () => {
    setReportType(p=>!p)
  }
  const getReport = async () => {
    const response = await API.get(`/reportDetails/${values[index]?.id}`);
    if(response.data){
      if(parseInt(response.data.data.edited_by) > 0){
        setButtonShow(true)
        setCount(response.data.data.edited_by)
      }
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SuccessDialog open={open} handleClose = {()=>setOpen(0)}/>
        <Box sx={{mt:5,pl:2,h:"100%"}}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={10}>
              <Box sx={{display:"flex",width:"100%",justifyContent:"center", alignItems:'center'}}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', paddingBottom: '10px', fontSize: '24px' }}>
                  {"Crime Details"}
                </Typography>
                {buttonShow && <Button variant="contained" color="primary" style={{position:"absolute",right:"16px",top:"36px" }} onClick={reportTypeHandler}>
                  {!reportType ? "Main":"Edited"} Report
                </Button>}
              </Box>
            </Grid>
            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                
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
                        {buttonShow &&
                          <h5 style={{background:"#e4e3e3",padding:"8px 12px",textAlign:"center"}} > This report is edited by {count} user{count>1 && 's'}. Check edited report{count>1 && 's'}.</h5>
                        }
                        <Table>
                          
                          <TableBody>
                            {data?.map((row, index) => {
                              return (<>
                              {typeof(row.secondCol) === "object" && <TableRow key={index}>
                                {row.secondCol != null && row.firstCol != "Description" && row.firstCol != "Perpetrators" && row.firstCol != "Edited by" && row.firstCol != "Media" && row.firstCol != "Reason for crime:" && <TableCell>{row.firstCol}</TableCell>}
                                {buttonShow && !reportType &&  row.firstCol == "Edited by" && <TableCell >{row.firstCol}</TableCell>}
                                {parseInt(profile?.role_id) !== "2" && row.firstCol == "Description" && parseInt(profile?.role_id) === 1 &&  <TableCell>{row.firstCol}</TableCell>}
                                {row.firstCol == "Perpetrators" &&  <TableCell>{row.firstCol}</TableCell>}
                                { row.firstCol == "Reason for crime:" && row.secondCol.props.dangerouslySetInnerHTML.__html != "Does not apply" && <TableCell>{row.firstCol}</TableCell>}
                                {parseInt(profile?.role_id) === 1 && row.firstCol == "Media" &&  <TableCell>{row.firstCol}</TableCell>}
                                {row.secondCol != null && row.firstCol != "Description" && row.firstCol != "Perpetrators" && row.firstCol != "Edited by" && row.firstCol != "Media" && row.firstCol != "Reason for crime:" &&  <TableCell>
                                  {row.firstCol === 'Media:' && mediaData ? (
                                    isImage(mediaData) ? (
                                      <img src={mediaData} alt="media" style={{ width: '100%', height: 'auto' }} />
                                    ) : isVideo(mediaData) ? (
                                      <video src={mediaData} controls style={{ width: '100%', height: 'auto' }} />
                                    ) : (
                                      'No media available'
                                    )
                                  ) : (
                                    row.secondCol
                                  )}
                                </TableCell>}
                                {parseInt(profile?.role_id) !== "2" && row.firstCol == "Description" && parseInt(profile?.role_id) === 1 &&  <TableCell>
                                  row.secondCol
                                </TableCell>}
                                {row.firstCol == "Perpetrators" && <TableCell>
                                    parseInt(profile?.role_id) === 1 ? row.secondCol[0] : row.secondCol[2]
                                </TableCell>}
                                { row.firstCol == "Reason for crime:" && row.secondCol.props.dangerouslySetInnerHTML.__html != "Does not apply" &&  <TableCell>{row.secondCol}</TableCell>}

                              {parseInt(profile?.role_id) === 1 && row.firstCol == "Media" && <TableCell>
                                {row.firstCol === 'Media:' && mediaData ? (
                                  isImage(mediaData) ? (
                                    <img src={mediaData} alt="media" style={{ width: '100%', height: 'auto' }} />
                                  ) : isVideo(mediaData) ? (
                                    <video src={mediaData} controls style={{ width: '100%', height: 'auto' }} />
                                  ) : (
                                    'No media available'
                                  )
                                ) : (
                                  row.secondCol
                                )}
                                </TableCell>}
                                {buttonShow && !reportType &&  row.firstCol === "Edited by" && <TableCell >{row.secondCol}</TableCell>}

                              </TableRow>}
                              {typeof(row.secondCol) === "string" && <TableRow key={index}>
                              {!row.secondCol.includes("Unavailable") && !row.secondCol.includes("Does not apply") && !row.secondCol.includes(null) && row.secondCol != "" &&  row.firstCol != "Description" && row.firstCol != "Perpetrators" && row.firstCol != "Edited by" && row.firstCol != "Media" && <TableCell>{row.firstCol}</TableCell>}
                              {buttonShow && !reportType &&  row.firstCol == "Edited by" && <TableCell >{row.firstCol}</TableCell>}
                              {parseInt(profile?.role_id) !== "2" && row.firstCol == "Description" && parseInt(profile?.role_id) === 1 &&  <TableCell>{row.firstCol}</TableCell>}
                              {row.firstCol == "Perpetrators" &&  <TableCell>{row.firstCol}</TableCell>}
                              {parseInt(profile?.role_id) === 1 && row.firstCol == "Media" &&  <TableCell>{row.firstCol}</TableCell>}

                              {!row.secondCol.includes("Unavailable") &&!row.secondCol.includes("Does not apply") && !row.secondCol.includes(null) && row.secondCol != "" &&  row.firstCol != "Description" && row.firstCol != "Perpetrators" && row.firstCol != "Edited by" && row.firstCol != "Media" &&  <TableCell>
                                {row.firstCol === 'Media:' && mediaData ? (
                                  isImage(mediaData) ? (
                                    <img src={mediaData} alt="media" style={{ width: '100%', height: 'auto' }} />
                                  ) : isVideo(mediaData) ? (
                                    <video src={mediaData} controls style={{ width: '100%', height: 'auto' }} />
                                  ) : (
                                    'No media available'
                                  )
                                ) : (
                                  row.secondCol
                                )}
                              </TableCell>}
                              {parseInt(profile?.role_id) !== "2" && row.firstCol == "Description" && parseInt(profile?.role_id) === 1 &&  <TableCell>
                                row.secondCol
                              </TableCell>}
                              {row.firstCol == "Perpetrators" && <TableCell>
                                parseInt(profile?.role_id) === 1 ? row.secondCol[0] : row.secondCol[2]
                              </TableCell>}
                              {parseInt(profile?.role_id) === 1 && row.firstCol == "Media" && <TableCell>
                                {row.firstCol === 'Media:' && mediaData ? (
                                  isImage(mediaData) ? (
                                    <img src={mediaData} alt="media" style={{ width: '100%', height: 'auto' }} />
                                  ) : isVideo(mediaData) ? (
                                    <video src={mediaData} controls style={{ width: '100%', height: 'auto' }} />
                                  ) : (
                                    'No media available'
                                  )
                                ) : (
                                  row.secondCol
                                )}
                                </TableCell>}
                              {buttonShow && !reportType &&  row.firstCol === "Edited by" && <TableCell >{row.secondCol}</TableCell>}

                            </TableRow>}
                            </>)
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Box sx={{ paddingTop: '5px',mb:10 }}>
                  
                      <Box display="flex" justifyContent="center">
                        {/* {buttonShow && <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={reportTypeHandler}>
                          {!reportType ? "Main":"Edited"} Report
                        </Button>} */}
                        <Button onClick={() => {
                            handleEdit(values[index]);
                        }} size="small">Edit Report</Button>
                        <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={onClose} disabled={lock}>
                          Close
                        </Button>
                      </Box>
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

export default CrimeDialog;
