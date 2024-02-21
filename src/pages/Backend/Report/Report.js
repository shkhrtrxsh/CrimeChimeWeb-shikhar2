import React, { Fragment, useEffect, useState,useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReports, deleteReport, reportStatus } from 'src/store/api/report';
import { ActiveInactiveButton } from 'src/components/Button';
import ActionOptions from 'src/components/ActionOptions'
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmDeleteDialog from 'src/components/ConfirmDeleteDialog'
import ChangeStatusDialog from 'src/components/ChangeStatusDialog';
import { fDateTime } from 'src/utils/formatTime';
import NoData from 'src/assets/svg/no-data.svg';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  Card,
  Tooltip,
  Link,
  
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator';
import { SearchInTable } from 'src/components/Table';
import { getSearchQueryParams, setSearchQueryParams, recordPerPage } from 'src/helpers/SearchHelper';
import { StyledGrid } from 'src/pages/Frontend/User/StyledGrid';
import { NoDataDialogRoot } from 'src/layouts/components/NoDataDialogRoot';
import { setError } from 'src/store/reducers/report';
import redEye from '../../../assets/images/red eye.png'
import greenEye from '../../../assets/images/green eye.png'
import API from 'src/config/api';
import SingleReport from './SingleReport';
import Image from '../../../assets/images/duplicate.png';
import Image1 from 'src/assets/images/corporateCrime.png';
import { setCrimeIndex, setPage, setZoom, } from 'src/store/reducers/registerReport';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Box, Drawer, useMediaQuery, useTheme,Typography } from '@mui/material';
import { SatelliteZoom } from 'src/constants/googleMap';
import { toast } from 'react-toastify';
import { getNearbyCrimes } from 'src/store/api/registerReport';
import { getLocationCoords, isWithinSAfrica } from 'src/utils/googleMap';
import { styled } from '@mui/material/styles';
import SearchFilter from 'src/pages/Frontend/ViewReport/SearchFilter';

const MapDivStyle = styled('div')(({ theme }) => ({
  height: `calc(100vh )`,
  width: '100%',
  '& .gm-control-active.gm-fullscreen-control': {
      display: 'none'
  }
}));
export default function Report() {
  const register = useSelector(state => state.reportRegister);
  const { data, zoom, nearbyData, crimeIndex } = register;
  const { longitude, latitude } = data;
  const dispatch = useDispatch();
  const map = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hidden, setHidden] = React.useState(false);
  const { reports: reportedData = {}, error,loading } = useSelector(state => state.report);
  const [openDialog, setOpenDialog] = React.useState({
    status: false,
    id: null
  }); 

  const markerOptions = {
    icon: {
      url: Image,
      scaledSize: new window.google.maps.Size(80, 80),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(25, 50)
    }
  };
  const markerOptions1 = {
    icon: {
        url: Image1,
        scaledSize: new window.google.maps.Size(30, 75),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(25, 50)
    }
  };
  useEffect(() => {
    if (!hidden) {
      const param = getSearchQueryParams(searchParams)
      const f1 = param.split("&")
      const f2 = f1[0].split("=")
      // dispatch(getReports({ param }));
      dispatch(getNearbyCrimes({ paginate:1,page:f2[1],latitude:null, longitude:null, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now()) }));
    }
  }, [searchParams,hidden])

  const setSearchByParam = (param) => {
    navigate(`/?${param}`)
  }
  const handlePageChange = (event, onPage) => {
    let param = setSearchQueryParams(searchParams, onPage)
    navigate(`/reports?${param}`)
  }

  const handleChangeRowsPerPage = (event) => {
    let param = setSearchQueryParams(searchParams, 0, event.target.value)
    navigate(`/reports?${param}`)
  }
  useEffect(() => {
    // if (!crimeIndex.viewCrime) {
    //   dispatch(getNearbyCrimes({ latitude, longitude, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now()) }));
    // }else{
      // dispatch(getNearbyCrimes({ latitude, longitude, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now()),paginate:1 }));
    // }
  }, [])
  // useEffect(() => {
  //   dispatch(clearReport());
  // }, [])

  useEffect(() => {
      if (!hidden) {
        dispatch(getNearbyCrimes({ latitude, longitude, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now()),paginate:1 }));

          // dispatch(getReports({ param: `per_page=10&order_by=latest` }));
      }
  }, [hidden])
  useEffect(() => {
    if (crimeIndex.viewCrime) {

      (async () => {
        const { latitude, longitude } = await getLocationCoords();
        dispatch(getNearbyCrimes({ latitude, longitude, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now()) }));
        setPage(latitude, longitude);
      })()
    }
  }, [])
  const callDeleteFunc = (status, id) => {
    if (status === true) {
        dispatch(deleteReport({ id }))
    }
  };
  const position = {
    lat: Number(latitude) + 0.0008,
    lng: Number(longitude) + 0.0008
  }
  const handleZoomChanged = () => {
    if (map.current) dispatch(setZoom(map.current.getZoom()))
  };
  const onLoad = async (Map) => {

    map.current = Map; // Store the map instance in a global variable for access in the event handler
    const { latitude: lat, longitude: lng } = await getLocationCoords();
    dispatch(setPage({ latitude: lat, longitude: lng }));
  }
  const theme = useTheme();
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));

  const onMarkerClick = (ind) => {
    dispatch(setCrimeIndex({ index: ind, viewCrime: true }));
  }

  const markerDragEnd = async(e) => {
    if (e !== null) {
      const geocoder = new window.google.maps.Geocoder();
      const [lat,lng] = [e.latLng.lat(), e.latLng.lng()];
      const [{latitude,longitude},isSA] = await isWithinSAfrica(lat,lng);
      if(!isSA){
        toast.error("Crimes can be reported only within South Africa");
        dispatch(setPage({latitude,longitude}))
        return;
      }
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          dispatch(setPage({ location: results[0].formatted_address, longitude: lng, latitude: lat, google_place_id: results[0].place_id }));
          dispatch(getNearbyCrimes({ latitude: lat, longitude: lng, fromDate: null, toDate: null }));
        }
      });
    }
  };
  const handleChange = (e) => {
      if(!hidden){
        dispatch(getNearbyCrimes({ latitude, longitude, fromDate: new Date(Date.now() - 365 * 24 * 3600 * 1000), toDate: new Date(Date.now())}));
        toast.info("Fetching details",{
          toastId:"skkskks"
        })
        setTimeout(() => {
          setHidden(s => !s)
        }, [3000]);
      }else{
        setHidden(s => !s)
      }
      
  }
  const deleteOptionAction = (event) => {
    setOpenDialog((prevState) => ({
      ...prevState,
      status: event.status,
      id: event.id
    }));
  }
  const refreshHandler = () => {
    navigate('/reports?page=2')
    setTimeout(()=>{
      navigate('/reports')
    },[200])
  }
  return (
    <Fragment>
      <BreadcrumbNavigator
        currentPage="Report List"
        centerButton={{ name: "add report", link: "/report/add" }}
      />
        <NoDataDialogRoot error={error} handleClose={()=>dispatch(setError(null))}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px"}}>
          
          <ToggleButtonGroup
            color="success"
            value={hidden}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value={true}>Map View</ToggleButton>
            <ToggleButton value={false}>Table View</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <SearchFilter paginate={!hidden ? 1:0} style={{right:"-15px"}} />
        <Box id="hello" >
          <MapDivStyle>

            {!hidden ? (
                <Card>
                    {/* <SearchInTable /> */}
                    {(nearbyData||!loading)&&(nearbyData?.data&&nearbyData?.data[0]) ?
                      <React.Fragment>
                          <TableContainer component={Paper}>
                              <Table aria-label="simple table" >
                                  <TableHead>
                                  <TableRow>
                                    <TableCell>Public Report Approval</TableCell>
                                    <TableCell>Date/Time Occurred</TableCell>
                                    <TableCell>Place Occurred</TableCell>
                                    <TableCell align="left">Crime Type</TableCell>
                                    <TableCell align="left">Mob. #</TableCell>
                                    <TableCell align="left">Username</TableCell>
                                    <TableCell align="left">Corp./Group</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                    <TableCell align="right">Show/Hide</TableCell>
                                  </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {nearbyData && (nearbyData.data || []).map((report, index) => {
                                          
                                          const latitude = Number(report.latitude);
                                          const longitude = Number(report.longitude);
                                          const formattedLatitude = latitude.toFixed(4);
                                          const formattedLongitude = longitude.toFixed(4);
                                          return (
                                          // <TableRow key={report.id}>
                                          //     <TableCell align="left">{fDateTime(report.date_time)}</TableCell>
                                          //     <TableCell component="th" scope="row">{report.location}<br></br>{formattedLatitude} S,<br></br>{formattedLongitude} E</TableCell>
                                          //     <TableCell align="left">
                                          //     {report.robbery != 0 ? (<>Robbery,<br /></>) : null}
                                          //     {report.murders != 0 ? (<>Murders,<br /></>) : null}
                                          //     {report.burglary !=0 ? (<>Burglary,<br /></>) : null}
                                          //     {report.kidnapping != 0 ? (<>Kidnapping,<br /></>) : null}
                                          //     {report.rape != 0 ? (<>Rape,<br /></>) : null}
                                          //     {report.weapons != 0 ? (<>Weapons,<br /></>) : null}
                                          //     </TableCell>
                                          //     {parseInt(reportedData?.user?.role_id) == 1 && <TableCell align="left">{report.user.phone}</TableCell>}
                                          //     <TableCell align="left">{report.user.username}</TableCell>
                                          //     <TableCell align="left"><div>{report.user.corporate ? report.user.corporate.name : '' }{report.user.corporate ? report.user.corporate.is_verify==1 ? <CheckBoxIcon style={{ color: "#29C250",position: "absolute" }} /> : '' : ''}</div></TableCell> 
                                          //     <TableCell align="right">
                                          //         <ActionOptions
                                          //             index={index}
                                          //             delete_id={report.id}
                                          //             show_url={'/report?target=single&id=' + report.id}
                                          //             add_note={'/add_not/' + report.id}
                                          //             deleteAction={(event) => {
                                          //                 setOpenDialog((prevState) => ({
                                          //                     ...prevState,
                                          //                     status: event.status,
                                          //                     id: event.id
                                          //                 }));
                                          //             }}
                                          //         />
                                          //     </TableCell>
                                          // </TableRow>
                                            <SingleReport key={index} refresh={refreshHandler} index={index} handler={deleteOptionAction} report={report} formattedLatitude={formattedLatitude} formattedLongitude={formattedLongitude} />
                                          )

                                      })}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                          {nearbyData && <TablePagination
                              rowsPerPageOptions={recordPerPage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              component="div"
                              count={nearbyData.total}
                              rowsPerPage={nearbyData.per_page}
                              page={nearbyData.current_page - 1}
                              onPageChange={handlePageChange}
                              />
                          }
                          </React.Fragment>
                          : <StyledGrid item md={9} xs={12}>
                              {/* <img src={NoData} alt="No Data Available" /> */}
                              <Typography variant="h4">Crime Records doesn't Exist</Typography>
                          </StyledGrid>
                    }
                </Card>
              )
              : (
              <GoogleMap center={position} zoom={zoom}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                mapTypeId: (zoom < SatelliteZoom) ? window.google.maps.MapTypeId.HYBRID : window.google.maps.MapTypeId.HYBRID,
                gestureHandling: "greedy",
                mapTypeControlOptions: {
                  position: isMdBreakpoint ? window.google.maps.ControlPosition.LEFT_TOP : window.google.maps.ControlPosition.LEFT_BOTTOM
                }
              }}
              onLoad={onLoad}
              onZoomChanged={handleZoomChanged}>
              <Marker id="mark" zIndex={100} draggable={true} position={position} onDragEnd={markerDragEnd} />
              {(nearbyData || []).map(({ latitude = null, longitude = null, user_count,user }, ind) => {
                const position = {
                  lat: Number(latitude),
                  lng: Number(longitude)
                };
                return (
                  <>
                    {user_count == '1' && user.corporat_id == null &&  <Marker key={ind} position={position} options={markerOptions}
                      onClick={() => onMarkerClick(ind)} zIndex={0}
                    />}
                    {user_count != '1' && user.corporat_id == null && <Marker key={ind} position={position} options={markerOptions}
                      onClick={() => onMarkerClick(ind)} label={{ text: `${user_count}`, fontWeight: "bold", className: "map-label", color: "red" }} zIndex={0}
                    />}
                    {user.corporat_id != null &&  <Marker key={ind} position={position} options={markerOptions1}
                      onClick={() => onMarkerClick(ind)} zIndex={0}
                    />}

                  </>
                )
              })}

              </GoogleMap>
            )}
          </MapDivStyle>

        </Box>
      

    </Fragment>
  );
}
