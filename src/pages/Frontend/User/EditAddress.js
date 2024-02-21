import React, {useEffect} from 'react';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { GoogleMap, Marker} from '@react-google-maps/api';
import { SaveButton } from 'src/components/Button'
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { updateUserAddress, showAuthUser } from 'src/store/api/user';
import { Container, Grid, Card } from '@mui/material'
import UserSideName from './components/UserSideNav';
import Page from '../../../components/Page';
import GoogleAutoComplete from 'src/components/GoogleMap/GoogleAutoComplete';
import { APPBAR_DESKTOP} from 'src/constants/theme'
import { mapSettings, CurrentLocationCoordinates } from 'src/helpers/LocationHelper';

const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP * 5}px)`
};


const EditAddress = () => {  
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formattedAddress, setFormattedAddress] =useState(null)
    const [value, setValue] = useState({
        latitude : 0,
        longitude : 0,
        google_place_id : '',
        address : ''
    })

    const { user } = useSelector((state) => ({ ...state.user }));
    useEffect(() => {
        dispatch(showAuthUser({}))
    }, [])

    const dPosition = CurrentLocationCoordinates()

    const [position , setPosition] = useState({
        lat: dPosition.lat,
        lng: dPosition.lng
    })

    const googleAutoComplete = (latitude, longitude, place_id, address, viewport) => {
        setValue({
            latitude : latitude,
            longitude : longitude,
            google_place_id : place_id,
            address : address
        })

        setPosition({
            lat: latitude,
            lng: longitude
        })

    }

    useEffect(()=> {
        if(user !== null && user.latitude !== null  && user.longitude !== null){
            setTimeout(function(){
                setPosition({
                    lat: Number(user.latitude),
                    lng: Number(user.longitude)
                })
            }, 500)
        }
    }, [user])

    const saveAddress = () => {
        dispatch(updateUserAddress({value, navigate}))
    }

    const markerDragEnd = (e) => {
        if (e !== null) {
            setValue(prev => ({
                ...prev,
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng()
            }))

            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`).then(response => {
                setFormattedAddress(response.data.results[0].formatted_address)
                setValue(prev => ({
                    ...prev,
                    'google_place_id': response.data.results[0].place_id,
                    'address': response.data.results[0].formatted_address
                }))
            })
        }
    }
  

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
                                    <GoogleAutoComplete googleAutoComplete={googleAutoComplete} formattedAddress={formattedAddress} />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <SaveButton onClick={saveAddress} sx={{width:"100%"}}>
                                        Save
                                    </SaveButton>
                                </Grid>

                                <Grid item xs={12}>
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={position}
                                        zoom={10}
                                        options={mapSettings}
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
