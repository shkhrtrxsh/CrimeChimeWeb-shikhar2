import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { showAuthUser } from 'src/store/api/user';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Box, Container, Grid, Avatar, Typography, IconButton } from '@mui/material'
import UserSideName from './components/UserSideNav';
import Page from '../../../components/Page';
import { APPBAR_DESKTOP } from 'src/constants/theme'
import EditIcon from '@mui/icons-material/Edit';
import { mapSettings, CurrentLocationCoordinates } from 'src/helpers/LocationHelper';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { getLocationCoords } from 'src/utils/googleMap';
import { setPage } from 'src/store/reducers/registerReport';
 import { jwtDecode } from "jwt-decode";
import { object } from 'prop-types';


const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP * 5}px)`
};

const InfoBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginTop: '15px'
}));

const HeadTypography = styled(Typography)(({ theme }) => ({
    width: '90px',
    // textAlign: 'right',
    marginRight: '20px',
    fontWeight: '600',
    fontSize: '1rem !important',
    [theme.breakpoints.down('md')]: {
        width: '80px',
    }
}));

const BodyTypography = styled(Typography)(({ theme }) => ({
    fontWeight: '500',
    fontSize: '1rem !important'
}));

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
    position: 'absolute !important',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    background: theme.palette.secondary.main,
    fontSize: '1.2rem',
    '&:hover': {
        background: theme.palette.secondary.main
    }
}));

const Profile = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const {latitude,longitude} = useSelector(state=>state.reportRegister.data);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [phone,setPhone] = useState();
    const [position, setPosition] = useState({
        lat: latitude,
        lng: longitude
    })

    

    useEffect(() => {
        // Dispatch the action to fetch user data
        dispatch(showAuthUser({}));
      }, []); // Add dispatch to the dependency array to prevent eslint warnings
    
      useEffect(() => {
        if (user?.id) {
          // If user is available, decode and set values
          const decodedHeader = jwtDecode(user?.name);
          setName(decodedHeader?.name);
    
          const decodedHeader2 = jwtDecode(user?.email);
          setEmail(decodedHeader2?.email);
    
          const decodedHeader3 = jwtDecode(user?.phone);
          setPhone(decodedHeader3?.phone);
        }
      }, [user]);

    useEffect(() => {
        if (user !== null && user.latitude !== null && user.longitude !== null) {
            setPosition({
                lat: Number(user.latitude),
                lng: Number(user.longitude)
            })
        }
    }, [user])

    const onLoad = async(Map) => {
          const {latitude:lat,longitude:lng} = await getLocationCoords();
          dispatch(setPage({latitude:lat,longitude:lng}));
        }

    return (
        <Page title={user && user.name}>
            <Fab color="primary" aria-label="add" sx={{position:"fixed",bottom:16,right:16}} onClick={()=>navigate("/report/add")}>
                <AddIcon />
            </Fab>
            <Container sx={{
                marginTop: '20px'
            }}>
                <Grid container spacing={3}>
                    <UserSideName />
                    <Grid item md={9} xs={12}>
                        <Paper sx={{
                            padding: '30px',
                            position: 'relative',
                            boxShadow: theme.shadows[4]
                        }}>
                            <Grid container spacing={3}>
                                <Grid item md={3} xs={12} sx={{
                                    position: 'relative'
                                }}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={user && process.env.REACT_APP_API_URL + '/' + user.avatar}
                                        sx={{
                                            width: '130px', height: '130px',
                                            [theme.breakpoints.down('md')]: {
                                                width: '150px',
                                                height: '150px',
                                                margin: 'auto',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={9} xs={12}>

                                    <IconButtonStyle
                                        aria-label="edit"
                                        component={RouterLink}
                                        to='/profile/edit'
                                        sx={{
                                            right: '15px',
                                            top: '15px',
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButtonStyle>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Name: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && name}</BodyTypography>
                                    </InfoBox>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Email: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && email}</BodyTypography>
                                    </InfoBox>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Username: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && user.username}</BodyTypography>
                                    </InfoBox>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Phone: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && phone}</BodyTypography>
                                    </InfoBox>

                                </Grid>
                            </Grid>
                        </Paper>
                        {/* <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <Paper sx={{
                                    padding: '30px',
                                    marginTop: '30px',
                                    position: 'relative',
                                    boxShadow: theme.shadows[4]
                                }}>
                                    <IconButtonStyle
                                        aria-label="edit"
                                        component={RouterLink}
                                        to='/profile/address-edit'
                                        sx={{
                                            right: '15px',
                                            top: '15px',
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButtonStyle>
                                    <Typography variant="h4" component="h2">Address</Typography>
                                    <BodyTypography variant="h5" component="h5" sx={{
                                        marginBottom: '30px'
                                    }}>{user && user.address}</BodyTypography>
                                    <GoogleMap
                                        onLoad={onLoad}
                                        mapContainerStyle={containerStyle}
                                        center={position}
                                        zoom={10}
                                        options={mapSettings}
                                    >
                                        <Marker
                                            position={position}
                                        />
                                    </GoogleMap>
                                </Paper>
                            </Grid>
                        </Grid> */}
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default Profile
