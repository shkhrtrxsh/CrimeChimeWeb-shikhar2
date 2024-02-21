import React, { useEffect, useRef, useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme,Typography } from '@mui/material';
import { getLocationCoords, isWithinSAfrica } from 'src/utils/googleMap';
import { useDispatch, useSelector } from 'react-redux';
import { setCrimeIndex, setEdit, setPage, setZoom, } from 'src/store/reducers/registerReport';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { SatelliteZoom } from 'src/constants/googleMap';
import Image from '../../../assets/images/duplicate.png';
import Image1 from 'src/assets/images/corporateCrime.png'
import Legend from 'src/assets/images/legend.png'
import Legend2 from 'src/assets/images/legend2.png'
import Legend3 from 'src/assets/images/legend3.png'
import Home from 'src/assets/images/Home.png'
import Office from 'src/assets/images/OfficeIcon.png'
import Favorite from 'src/assets/images/favorite.png'

import SearchFilter from '../ViewReport/SearchFilter';
import CrimeDialog from "./CrimeDialog2";
import { getNearbyCrimes } from 'src/store/api/registerReport';
import { NoDataDialog } from '../../../layouts/components/NoDataDialog';
import { toast } from 'react-toastify';
import TransparentFab from 'src/layouts/components/TransparentFab';
import { styled } from '@mui/material/styles';
import { APPBAR_DESKTOP } from 'src/constants/theme'
import { Link, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { NoDataDialogRoot } from 'src/layouts/components/NoDataDialogRoot';
import { setError } from 'src/store/reducers/report';
import ConfirmDeleteDialog from 'src/components/ConfirmDeleteDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TableViewIcon from '@mui/icons-material/TableView';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { StyledGrid } from '../User/StyledGrid';
import { fDateTime } from 'src/utils/formatTime';
import ActionOptions from 'src/components/ActionOptions';
import { getSearchQueryParams, setSearchQueryParams, recordPerPage } from 'src/helpers/SearchHelper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NoData from 'src/assets/svg/no-data.svg';
import { getReports, deleteReport, reportStatus, getCrimes } from 'src/store/api/report';
import { clearReport, setNearbyReports } from 'src/store/reducers/registerReport';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import ActionOptionsTwo from 'src/components/ActionOptionsTwo';
const BoxButtonStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '15px',
  top: APPBAR_DESKTOP + 15 + 110 + 'px',
  '& .MuiButtonBase-root.MuiFab-root': {
      marginRight: '10px'
  }
}));
const MapDivStyle = styled('div')(({ theme }) => ({
  height: `calc(100vh )`,
  width: '100%',
  '& .gm-control-active.gm-fullscreen-control': {
      display: 'none'
  }
}));
export default function CrimeDetail() {
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
      const markerOptionsHome = {
        icon: {
          url: Home,
          scaledSize: new window.google.maps.Size(30, 75),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(25, 50)
        }
      };
      const markerOptionsOffice = {
        icon: {
          url: Office,
          scaledSize: new window.google.maps.Size(30, 75),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(25, 50)
        }
      };
      const markerOptionsFavorite = {
        icon: {
          url: Favorite,
          scaledSize: new window.google.maps.Size(30, 75),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(25, 50)
        }
      };
      const dispatch = useDispatch();
      const map = useRef(null);
      const navigate = useNavigate();
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const register = useSelector(state => state.reportRegister);
      const { data, zoom, nearbyData, crimeIndex } = register;
      const { longitude, latitude } = data;
      const theme = useTheme();
      const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));
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
      const [hasMount,setHasMount] = useState(false)
      useEffect(() => {
        dispatch(getNearbyCrimes({ id:queryParams.get('id')}));
        
        if(queryParams.get('show') == "true"){
          dispatch(setCrimeIndex({ index:queryParams.get('id'),viewCrime: true }))
        }
        toast.info("fetching details",{
            toastId:'skjdjd'
        })
        setTimeout(()=>{
            setHasMount(true)
        },[3000])
      }, [])
    
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: isMdBreakpoint ? 'row' : 'column' }}>
          <NoDataDialog/>
          <Drawer anchor="left" open={crimeIndex.viewCrime} onClose={() => dispatch(setCrimeIndex({ viewCrime: false }))}>
            <Box sx={{ display: "flex", alignItems: "center", maxWidth: "500px" }}>
              <CrimeDialog mapRef={map} index={crimeIndex.index} onClose={() => dispatch(setCrimeIndex({ viewCrime: false }))} />
            </Box>
          </Drawer>
          {hasMount && <Box id="hello" sx={{ width: '100%', height: '100%' }}>
            <MapDivStyle>
    
                <GoogleMap center={position} zoom={zoom}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    mapTypeId: (zoom > SatelliteZoom) ? window.google.maps.MapTypeId.HYBRID : window.google.maps.MapTypeId.HYBRID,
                    gestureHandling: "greedy",
                    mapTypeControlOptions: {
                      position: isMdBreakpoint ? window.google.maps.ControlPosition.LEFT_TOP : window.google.maps.ControlPosition.LEFT_BOTTOM
                    }
                  }}
                  onLoad={onLoad}
                  onZoomChanged={handleZoomChanged}>
                    <Marker id="mark" zIndex={100} draggable={true} position={position} onDragEnd={markerDragEnd} />
                    {nearbyData && nearbyData?.map(({ latitude = null, longitude = null, user_count,user }, ind) => {
                      const position = {
                        lat: Number(latitude),
                        lng: Number(longitude)
                      };
                      return (
                        <>
                          {queryParams.get('type') == "all" && user_count == '1' && user?.corporat_id == null &&  <Marker key={ind} position={position} options={markerOptions}
                            onClick={() => onMarkerClick(ind)} zIndex={0}
                          />}
                          {queryParams.get('type') == "all" && user_count != '1' && user?.corporat_id == null && <Marker key={ind} position={position} options={markerOptions}
                            onClick={() => onMarkerClick(ind)} label={{ text: `${user_count}`, fontWeight: "bold", className: "map-label", color: "red" }} zIndex={0}
                          />}
                          {queryParams.get('type') == "all" && user?.corporat_id != null &&  <Marker key={ind} position={position} options={markerOptions1}
                            onClick={() => onMarkerClick(ind)} zIndex={0}
                          />}
                          {queryParams.get('type') == "Home" &&   <Marker key={ind} position={position} options={markerOptionsHome}
                            onClick={() => onMarkerClick(ind)} zIndex={0}
                          />}
                          {queryParams.get('type') == "Office" &&  <Marker key={ind} position={position} options={markerOptionsOffice}
                            onClick={() => onMarkerClick(ind)} zIndex={0}
                          />}
                          {queryParams.get('type') == "Favorite" && <Marker key={ind} position={position} options={markerOptionsFavorite}
                            onClick={() => onMarkerClick(ind)} zIndex={0}
                          />}
    
                        </>
                      )
                    })}
                </GoogleMap>
            </MapDivStyle>
    
          </Box>}
        </Box>
      );
}
