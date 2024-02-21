import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import {
    Stack,
    Container,
    Typography,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector, useDispatch } from 'react-redux';
import { addReport, getCrimes, getSpecificCrimesById } from 'src/store/api/report';
import * as Yup from 'yup';
import "yup-phone";

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { SaveButton } from 'src/components/Button';
import { APPBAR_DESKTOP } from 'src/constants/theme'
import UploadImage from 'src/components/UploadImage';
import UploadVideo from 'src/components/UploadVideo';
import GoogleAutoComplete from 'src/components/GoogleMap/GoogleAutoComplete';
import { positionLatitude, positionLongitude, mapSettings, CurrentLocationCoordinates } from 'src/helpers/LocationHelper';


const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP}px)`
};

const PaperStyle = styled(Card)(({ theme }) => ({
    // padding:'.5rem',
    boxShadow: `${theme.shadows[3]} !important`,
    borderRadius: Number(theme.shape.borderRadius),
    [theme.breakpoints.up('sm')]: {
        height: `calc(100vh - ${APPBAR_DESKTOP}px)`,
        overflowY: "auto",
    },
    '& .MuiPaper-root.MuiPaper-elevation': {
        boxShadow: 'none'
    }
}));

const ImageIcon = styled('img')(({ theme }) => ({
    width: '25px'
}));

const CrimeFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiSelect-select.MuiSelect-outlined .MuiListItemIcon-root': {
        float: 'left',
        minWidth: '40px',
        marginTop: '5px'
    }
}));

const ContentStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
}));

const HeaderStyle = styled('div')(({ theme }) => ({
    margin: '2rem 2rem .6rem 2rem'
}));


const AddReportMap = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clc = CurrentLocationCoordinates()
    const [formattedAddress, setFormattedAddress] =useState(null)

    const [crime, setCrime] = useState('');
    const [specificCrime, setSpecificCrime] = useState('');

    const { crime_list } = useSelector((state) => ({ ...state.report }));
    const { specific_crime_list } = useSelector((state) => ({ ...state.report }));
    const { short_address } = useSelector((state) => ({ ...state.reportRegister.data }));
    useEffect(() => {
        dispatch(getCrimes({}))
    }, [])

    useEffect(() => {
        let id = crime === '' ? 0 : crime;
        setSpecificCrime('');
        dispatch(getSpecificCrimesById({ id }))
    }, [crime])

    const [position, setPosition] = useState({
        lat: clc.lat,
        lng: clc.lng
    })

    const googleAutoComplete = (latitude, longitude, place_id, address, viewport) => {
        setValue('latitude', latitude);
        setValue('longitude', longitude);
        setValue('google_place_id', place_id);
        setValue('location', address);
        setValue('short_address',short_address);
        setPosition({
            lat: latitude,
            lng: longitude
        })

    }

    const addFileHandler = (files) => {
        setValue('files', files)
    }

    const addvFileHandler = (vfiles) => {
        setValue('vfiles', vfiles)
    }

    const LoginSchema = Yup.object().shape({
        location: Yup.string().required('Crime location is required'),
        // position: Yup.string().required('Position is required'),
        // crime_type: Yup.string().required('Select your crime type'),
        // specific_crime: Yup.string().required('Select your specific crime'),
        // files: Yup.string().required('Upload images are required'),
        // description: Yup.string().required('Description is required'),
    });

    const defaultValues = {
        location: '',
        short_address: '',
        longitude: '',
        latitude: '',
        google_place_id: '',
        crime: '',
        specific_crime: '',
        files: {},
        vfiles: {},
        description: ''
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        setValue
    } = methods;

    const onSubmit = (formValue) => {
        formValue.crime = crime
        formValue.specific_crime = specificCrime
        dispatch(addReport({ formValue, navigate }))
    };

    const markerDragEnd = (e) => {
        if (e !== null) {
            setValue('latitude', e.latLng.lat());
            setValue('longitude', e.latLng.lng());

            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`).then(response => {
                setFormattedAddress(response.data.results[0].formatted_address)
                setValue('google_place_id', response.data.results[0].place_id);
                setValue('location', response.data.results[0].formatted_address);
            })
        }
    }

    return (
        <Grid container>
            <Grid item md={4} xs={12}>
                <ContentStyle>
                    <PaperStyle>
                        <HeaderStyle>
                            <Typography variant="h4">
                                Report now
                            </Typography>
                        </HeaderStyle>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <GoogleAutoComplete googleAutoComplete={googleAutoComplete} formattedAddress={formattedAddress} />
                                <CrimeFormControl sx={{ m: 1, minWidth: 80 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Select Crime Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={crime}
                                        onChange={(value) => { setCrime(value.target.value) }}
                                        fullWidth
                                        label="Select Crime Type"
                                    >
                                        {crime_list && crime_list.map((crime, index) => (
                                            <MenuItem value={crime.id} key={index}>
                                                <ListItemIcon>
                                                    <ImageIcon src={process.env.REACT_APP_API_URL + '/' + crime.icon_3d} />
                                                </ListItemIcon>
                                                <ListItemText>{crime.name}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </CrimeFormControl>
                                <FormControl sx={{ m: 1, minWidth: 80 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Select Specific Crime</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={specificCrime}
                                        onChange={(value) => { setSpecificCrime(value.target.value) }}
                                        fullWidth
                                        label="Select Specific Crime"
                                    >
                                        {specific_crime_list && specific_crime_list.map((crime, index) => (
                                            <MenuItem value={crime.id} key={index}>
                                                {crime.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <UploadImage addFiles={addFileHandler} />
                                    <UploadVideo addFiles={addvFileHandler} />

                                </FormControl>
                                <RHFTextField name="description" label="Enter Description" multiline />
                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
                                <SaveButton fullWidth type="submit">
                                    Report
                                </SaveButton>
                            </Stack>
                        </FormProvider>
                    </PaperStyle>
                </ContentStyle>
            </Grid>
            <Grid item md={8} xs={12}>
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
    )
}

export default AddReportMap;