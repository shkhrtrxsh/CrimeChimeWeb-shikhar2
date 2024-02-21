import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { getMyReport } from 'src/store/api/report';
import { Box, Button, Grid, Tooltip } from '@mui/material';
import UserSideName from '../components/UserSideNav';
import Page from '../../../../components/Page';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { setCrimeIndex, setEdit, setNearbyReports, setPage } from 'src/store/reducers/registerReport';
import { css } from '@emotion/css';
import ClampLines from 'react-clamp-lines';
import NoData from 'src/assets/svg/no-data.svg';
import { useTheme } from '@emotion/react';
import { NoDataDialogRoot } from 'src/layouts/components/NoDataDialogRoot';
import { setError } from 'src/store/reducers/report';
import { StyledGrid } from '../StyledGrid';
import BreadcrumbNavigator from '../../../../components/BreadcrumbNavigator';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    Paper, 
    Container, 
    Stack, 
  } from '@mui/material';
import API from 'src/config/api';
import { toast } from 'react-toastify';
import SingleAddress from './SingleAddress';
const MyAddresses = () => {
    const [list,setList] = useState([])
    const addressList = async () => {
        const response = await API.get(`/listAddress`);
        if(response.data.success){
            setList(response.data.data)
        }else{
            toast.error(response.data.message,{
                toastId:'skjs'
            })
        }
    };
    useEffect(() => {
        addressList();
    }, [])
    return (
        <Page title="Public Accesibility">
            <Container sx={{
                marginTop: '20px',
            }}>
                {/* <NoDataDialogRoot error={error} handleClose={()=>dispatch(setError(""))}/> */}
                <Grid container spacing={3}>
                    <UserSideName />
                    <Grid item md={9} xs={12}>
                        <BreadcrumbNavigator
                            currentPage="My Crime Tracker Locations" 
                            rightButton={{name: "add Location", link: "/my-addresses/add"}} 
                        />
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">Location Type</TableCell>
                                    <TableCell align="left">Location</TableCell>
                                    <TableCell align="left">Created At</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {list.length > 0 ? list.map((address, index) => {
                                    const latitude = Number(address.latitude);
                                    const longitude = Number(address.longitude);
                                    const formattedLatitude = latitude.toFixed(4);
                                    const formattedLongitude = longitude.toFixed(4);
                                    return (
                                        <SingleAddress key={index} index={index} report={address} formattedLatitude={formattedLatitude} formattedLongitude={formattedLongitude} handler={addressList} />
                                    )
                                    }) : 
                                    <Typography variant="h6" sx={{ fontWeight: 'normal', textAlign: 'left' }}>
                                        No Location added .......
                                        <br />
                                        Add up to three locations.Receive a notification whenever a crime is reported within 500 meters (0.5 Km ) of your selected locations.
                                        You can change your selected locations at any time.**
                                    </Typography>
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default MyAddresses
