import React, {useEffect} from 'react';
import { useState } from 'react';
import { useNavigate,useParams} from 'react-router-dom';
import { GoogleMap, Marker} from '@react-google-maps/api';
import { SaveButton } from 'src/components/Button'
import axios from 'axios';
import { setPage, setZoom, } from 'src/store/reducers/registerReport';

import { useSelector, useDispatch } from 'react-redux';
import { updateUserAddress, showAuthUser,updateSingleAddress } from 'src/store/api/user';
import { Container, Grid, Card, Box, Button } from '@mui/material'
import UserSideName from '../components/UserSideNav';
import Page from '../../../../components/Page';
import GoogleAutoComplete from 'src/components/GoogleMap/GoogleAutoComplete';
import { APPBAR_DESKTOP} from 'src/constants/theme'
import { mapSettings, CurrentLocationCoordinates } from 'src/helpers/LocationHelper';
import API from 'src/config/api';
import { toast } from 'react-toastify';
import { isWithinSAfrica } from 'src/utils/googleMap';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
import { SatelliteZoom } from "src/constants/googleMap";
import home from 'src/assets/images/Home1.png';
import office from 'src/assets/images/Office.png';
import favorite from 'src/assets/images/Favourite.png';

import {Typography} from '@mui/material';const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP * 5}px)`
};


const EditAddress = () => {  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const register = useSelector((state) => state.reportRegister);
    const {
        data,
        zoom,
        lock,
        marker,
        duplicate,
        nearbyData = [],
        edit,
      } = register;
    // const [formattedAddress, setFormattedAddress] =useState(null)
    const [value, setValue] = useState({
        latitude : 0,
        longitude : 0,
        google_place_id : '',
        address : ''
    })

    // const { user } = useSelector((state) => ({ ...state.user }));
    // useEffect(() => {
    //     dispatch(showAuthUser({}))
    // }, [])

    const dPosition = CurrentLocationCoordinates()

    const [position , setPosition] = useState({
        lat: dPosition.lat,
        lng: dPosition.lng
    })
    const [location,setLocation] = useState('')
    const [latitude,setLatitude] = useState('')
    const [longitude,setLongitude] = useState('')
    // const googleAutoComplete = (latitude, longitude, place_id, address, viewport) => {
    //     setValue({
    //         latitude : latitude,
    //         longitude : longitude,
    //         google_place_id : place_id,
    //         address : address
    //     })

    //     setPosition({
    //         lat: latitude,
    //         lng: longitude
    //     })

    // }

    // useEffect(()=> {
    //     addressList();
    // }, [])

    // const saveAddress = () => {
    //     dispatch(updateSingleAddress({value, navigate}))
    // }
    // const addressList = async () => {
    //     const response = await API.get(`/listAddress`);
    //     if(response.data.success){
    //         // setList(response.data.data)
    //         response.data.data.map((item)=>{
    //             if(item.id == params.id && item !== null && item.latitude !== null  && item.longitude !== null){
    //                 setTimeout(function(){
    //                     setPosition({
    //                         lat: Number(item.latitude),
    //                         lng: Number(item.longitude)
    //                     })
    //                 }, 500)
    //             }
    //         })
            
    //     }else{
    //         toast.error(response.data.message,{
    //             toastId:'skjs'
    //         })
    //     }
    // };
    const mapOptions = {
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        mapTypeId:
          zoom > SatelliteZoom
            ? window.google.maps.MapTypeId.HYBRID
            : window.google.maps.MapTypeId.HYBRID,
    };
    const markerDragEnd = async(e) => {
        if (e !== null) {
          //check if within S.Africa
          const [lat,lng] = [e.latLng.lat(), e.latLng.lng()];
          const [_,isSA] = await isWithinSAfrica(lat,lng);
          if(!isSA){
            toast.error("Crimes can be reported only within South Africa");
            dispatch(setPage({latitude,longitude}))
            return;
          }
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              dispatch(setPage({location:results[0].formatted_address,longitude:lng,latitude: lat,google_place_id:results[0].place_id}));
              setValue({
                'latitude' : lat,
                'longitude' : lng,
                'google_place_id' : results[0].place_id,
                'address' : results[0].formatted_address
                })
                setTimeout(function(){
                    setPosition({
                        lat: Number(lat),
                        lng: Number(lng)
                    })
                }, 500)
            }
          });
        }
    };
    const [type,setType] = useState("Home")
    const typeHandler = (e) => {
        setType(e.target.getAttribute("value"))
    }
    const updateAddress = async () => {
        const formValue = {
            id: params.id,
            name_location:type,
            latitude:value.latitude,
            longitude:value.longitude,
            address:value.address
        }
        const response = await API.post(`/user/addAddress`,formValue);
        if(response.data.code == 200){
            toast.success(response.data.message,{
                toastId:'jjjs'
            })
            navigate('/my-addresses');
        }else{
            toast.error(response.data.message,{
                toastId:'djjii'
            })
        }
    }
    const handlePlaceSelected = async(place) => {
        const {lat,lng}=place.geometry.location;
        const {formatted_address:location,place_id:google_place_id} = place;
        const [{latitude,longitude},isSA] = await isWithinSAfrica(lat(),lng());
          if(!isSA){
            toast.error("Crimes can be reported only within South Africa");
            dispatch(setPage({latitude,longitude}))
            return;
          }
        setValue({
            'latitude' : latitude,
            'longitude' : longitude,
            'google_place_id' : google_place_id,
            'address' : location
        })
        setTimeout(function(){
            setPosition({
                lat: Number(latitude),
                lng: Number(longitude)
            })
        }, 500)
        // document.webkitExitFullscreen();
      };
    return (
        <Page title="Edit Address">
            <Container sx={{
                marginTop: '20px'
            }}>
                <Grid container spacing={3}>
                    <UserSideName />
                    <Grid item md={9} xs={12}>
                        <Card sx={{
                            padding: '1.3rem'
                        }}>
                            <Grid container spacing={4}>
                                <Grid item md={9} xs={12}>
                                <ReactGoogleAutocomplete
                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                    options={{
                                        bounds: new window.google.maps.LatLngBounds(
                                        new window.google.maps.LatLng(-26.2751, 27.9639),
                                        new window.google.maps.LatLng(-26.0313, 28.2336)
                                        ),
                                        types: ['geocode','establishment'],
                                    }}
                                    style={{height:"50px",padding:"10px",borderRadius:10,width:250}}
                                    onPlaceSelected={handlePlaceSelected}
                                />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <SaveButton onClick={updateAddress} sx={{width:"100%"}}>
                                        Save
                                    </SaveButton>
                                </Grid>
                                {/* <Typography variant="h5" sx={{px:5,pt:3,fontWeight:"500"}}>Add a tag for your replace</Typography> */}
                                <Grid item md={12} sx={{display:"flex",justifyContent:"center",gap:"20px"}}>
                                    <Button value="Home" onClick={typeHandler} variant={type !== "Home" ? "contained":"outlined"}><img src={home} style={{height:"20px",width:"20px"}} />Home</Button>
                                    <Button value="Office" onClick={typeHandler}  variant={type !== "Office" ? "contained":"outlined"}><img src={office} style={{height:"20px",width:"20px"}} />Office</Button>
                                    <Button value="Favorite" onClick={typeHandler}  variant={type !== "Favorite" ? "contained":"outlined"}><img src={favorite} style={{height:"20px",width:"20px"}} />Favorite</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={position}
                                        zoom={10}
                                        options={mapOptions}
                                    >
                                        <Marker
                                            position={position}
                                            draggable={true}
                                            onDragEnd={markerDragEnd}
                                        />
                                    </GoogleMap>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default EditAddress
