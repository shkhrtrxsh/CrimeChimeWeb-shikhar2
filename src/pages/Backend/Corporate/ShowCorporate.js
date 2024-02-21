import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { showUser } from 'src/store/api/user';
import { useNavigate, useParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Box, Container, Grid, Avatar, Typography, IconButton } from '@mui/material'
import Page from '../../../components/Page';
import { APPBAR_DESKTOP } from 'src/constants/theme'
import EditIcon from '@mui/icons-material/Edit';
import { mapSettings, CurrentLocationCoordinates } from 'src/helpers/LocationHelper';


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

const ShowUser = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const params = useParams();
    const dPosition = CurrentLocationCoordinates()

    const [position, setPosition] = useState({
        lat: dPosition.lat,
        lng: dPosition.lng
    })

    const { user } = useSelector((state) => ({ ...state.user }));

    useEffect(() => {
        const id = params.id
        dispatch(showUser({id}))
    }, [params])

    useEffect(() => {
        if (user !== null && user.latitude !== null && user.longitude !== null) {
            setPosition({
                lat: Number(user.latitude),
                lng: Number(user.longitude)
            })
        }
    }, [user])

    return (
        <Page title={user && user.name}>
            <Container sx={{
                marginTop: '20px'
            }}>
                <Grid container spacing={3}>
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
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Name: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && user.name}</BodyTypography>
                                    </InfoBox>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Email: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && user.email}</BodyTypography>
                                    </InfoBox>
                                    <InfoBox>
                                        <HeadTypography variant="h5" component="h5">Phone: </HeadTypography>
                                        <BodyTypography variant="h5" component="h5">{user && user.phone}</BodyTypography>
                                    </InfoBox>

                                </Grid>
                            </Grid>
                        </Paper>
                        <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <Paper sx={{
                                    padding: '30px',
                                    marginTop: '30px',
                                    position: 'relative',
                                    boxShadow: theme.shadows[4]
                                }}>
                                    <Typography variant="h4" component="h2">Address</Typography>
                                    <BodyTypography variant="h5" component="h5" sx={{
                                        marginBottom: '30px'
                                    }}>{user && user.address}</BodyTypography>
                                    <GoogleMap
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
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default ShowUser
