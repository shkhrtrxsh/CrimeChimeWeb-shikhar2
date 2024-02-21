import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
    TextField,
    Paper,
    Button,
    Stack,
    Container,
    IconButton,
    InputAdornment,
    Typography,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { useNavigate, Link} from 'react-router-dom';
import { DRAWER_WIDTH, APPBAR_MOBILE, APPBAR_DESKTOP} from 'src/constants/theme'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector, useDispatch } from 'react-redux';
import { addReport, getCrimes, getSpecificCrimesById } from 'src/store/api/report';




const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP}px)`
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const PaperStyle = styled(Card)(({ theme }) => ({
    // padding:'.5rem',
    boxShadow: `${theme.shadows[3]} !important`,
    borderRadius: Number(theme.shape.borderRadius),
    '& .MuiPaper-root.MuiPaper-elevation': {
        boxShadow: 'none'
    }
}));

const BoxButtonStyle = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: '15px',
    top: APPBAR_DESKTOP + 15 + 'px',
    '& .MuiButtonBase-root.MuiFab-root':{
      marginRight: '10px'
    }
  }));

  const MapDivStyle = styled('div')(({ theme }) => ({
    height: `calc(100vh - ${APPBAR_DESKTOP}px)`, 
    width: '100%',
    '& .gm-control-active.gm-fullscreen-control':{
      display : 'none'
    } 
  }));

const ShowGoogleMap = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    const [position, setPosition] = useState({
        lat: 0,
        lng: 0
    })

    const [currentLocation, setCurrentLocation] = useState({
        lat: 1,
        lng: 1
    })


    const markerMovementStart = (e) => {
        // console.log(e)
    }

    useEffect(() => {
        if(map !== null){
            // console.log('map lat', map.center.lat())
            // console.log('map lng', map.center.lng())
        }        
    }, [map])

    const onLoad = (e) => {
        // console.log('on-load lat', e.position.lat())
        // console.log('on-load lng', e.position.lng())
    }

    const markerDragStart = (e) => {
        // console.log(e)
    }

    const markerDragEnd = (e) => {
        if(e !== null){
            // console.log(e.latLng.lat())
            // console.log(e.latLng.lng())
        }
    }

    return (
        <MapDivStyle>
            <BoxButtonStyle>
                <Fab 
                size="medium" 
                color="primary" 
                aria-label="add report" 
                to="/report/add"
                component={Link}
                >
                <AddIcon />
                </Fab>
                <Fab 
                size="medium" 
                color="primary" 
                aria-label="reported crimes"
                >
                <VisibilityIcon />
                </Fab>          
            </BoxButtonStyle>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={10}
                options={{
                    // zoomControl: false,
                    // streetViewControl: false,
                    // mapTypeControl: false,

                    fullscreenControl: false,
                }}
                // onLoad={map => setMap(map)}
            >
                <Marker
                    position={currentLocation}
                    draggable={true}
                    onDragStart={markerDragStart}
                    onDragEnd={markerDragEnd}
                    // map={map}
                    // onLoad={onLoad}
                    // onDraggableChanged={(e) => markerMovementStart(e)}
                />
            </GoogleMap>
        </MapDivStyle>
    )
}

export default ShowGoogleMap;