import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { styled, useTheme } from '@mui/material/styles';
import {
    Stack,
    Typography,
    Drawer,
    Paper
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { getReportByArea } from 'src/store/api/report';
import { CurrentLocationCoordinates } from 'src/helpers/LocationHelper';

import { APPBAR_DESKTOP } from 'src/constants/theme'
import SearchFilter from './SearchFilter';
import { mapSettings } from 'src/helpers/LocationHelper';
import { Box } from '@mui/system';
import {SearchInTable} from 'src/components/Table';
import { useNavigate } from 'react-router-dom';
import { ActiveInactiveButton } from 'src/components/Button';
import { fDateTime } from 'src/utils/formatTime';
import useResponsive from 'src/hooks/useResponsive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TableViewIcon from '@mui/icons-material/TableView';

import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    Card,
    Fab,
  } from '@mui/material';
  import { getSearchQueryParams, setSearchQueryParams, recordPerPage } from 'src/helpers/SearchHelper';



const containerStyle = {
    width: '100%',
    height: `calc(100vh - ${APPBAR_DESKTOP}px)`
};

const OuterPaperStyle = styled(Paper)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        width: '500px',
    },
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '60px'
}));

const ImageList = styled('img')(({ theme }) => ({
    width:'47%',
    margin: '1% 1.5%',
    display: 'inline-block',
    boxShadow: `${theme.shadows[3]} !important`,
    borderRadius: Number(theme.shape.borderRadius),
}));

const ViewReportMap = (props) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const theme = useTheme();
    const [detailToggleState, setDetailToggleState] = useState(false);
    const [reportDetail, setReportDetail] = useState(null);
    const [newViewport, setNewViewport] = useState({
        lat:0,
        lng:0
    })
    const navigate = useNavigate();

    const setSearchByParam = (param) => {
        navigate(`/reportscrime?${param}`)
    }
    const handlePageChange = (event, onPage) => {
        let param = setSearchQueryParams(searchParams, onPage)
        navigate(`/reportscrime?${param}`)
    }
    
    const handleChangeRowsPerPage = (event) => {
        let param = setSearchQueryParams(searchParams, 0, event.target.value)
        navigate(`/reportscrime?${param}`)
    }
    const detailToggleDrawer = (event) => {
        setDetailToggleState(event);
    };

    let position = CurrentLocationCoordinates()

    const BoxButtonStyle = styled(Box)(({ theme }) => ({
        position: 'absolute',
        right: '15px',
        top: APPBAR_DESKTOP + 15 + 'px',
        '& .MuiButtonBase-root.MuiFab-root': {
            marginRight: '10px'
        }
    }));
    
    const { reports } = useSelector((state) => ({ ...state.report }));

    useEffect(() => {
        let query = '';
        if (searchParams.get('id')) {
            query += `id=${searchParams.get('id')}`
        } else {
            if (searchParams.get('iahi') !== null && searchParams.get('iahi') !== "") {
                query += `iahi=${searchParams.get('iahi')}&`
            }
            if (searchParams.get('ialo') !== null && searchParams.get('ialo') !== "") {
                query += `ialo=${searchParams.get('ialo')}&`
            }
            if (searchParams.get('wahi') !== null && searchParams.get('wahi') !== "") {
                query += `wahi=${searchParams.get('wahi')}&`
            }
            if (searchParams.get('walo') !== null && searchParams.get('walo') !== "") {
                query += `walo=${searchParams.get('walo')}&`
            }
            if (searchParams.get('location') !== null && searchParams.get('location') !== "") {
                query += `location=${searchParams.get('location')}&`
            }
            if (searchParams.get('crime') !== null && searchParams.get('crime') !== "") {
                query += `crime=${searchParams.get('crime')}&`
            }
            if (searchParams.get('specific-crime') !== null && searchParams.get('specific-crime') !== "") {
                query += `specific-crime=${searchParams.get('specific-crime')}&`
            }
            if (searchParams.get('specific-time') !== null && searchParams.get('specific-time') !== "") {
                query += `specific-time=${searchParams.get('specific-time')}`
            }
            
        }
        dispatch(getReportByArea({ query }))
        
    }, [searchParams])

    useEffect(() => {
        if (searchParams.get('target') === 'single' && reports.data !== null && reports.data.length !== 0) {
            setNewViewport({
                lat : Number(reports.data[0].latitude),
                lng : Number(reports.data[0].longitude)
            })
            setReportDetail(reports.data[0])
            setDetailToggleState(true)
        }
    }, [reports])

    const reportDetails = (report) => {
        setReportDetail(report)
        setDetailToggleState(true)
    }

    const viewportPosition = (pos) => {
        setNewViewport({
            lat:pos.lat,
            lng:pos.lng
        })
    }

    const printDate = (created_at) => {
        let objectDate = new Date(created_at);
        return objectDate.getDate() + '/' + objectDate.getMonth() + '/' + objectDate.getFullYear()
    }
    const [hidden, setHidden] = React.useState(true);
    const isDesktop = useResponsive('up', 'md');
    const admin = reports?.admin?true:false;
    return (
        <>
            
            <BoxButtonStyle sx={{position: 'absolute',right: '0px',top:'385px'}} onClick={() => setHidden(s => !s)}>
                {!hidden ? 
                    <Fab
                        size="medium"
                        color="primary"
                        aria-label="view report"
                        title="Map view" 
                        variant='extended'
                        >
                        <Typography component='h6'>Listed Crimes</Typography>
                        <LocationOnIcon />
                    </Fab>
                    : 
                    <Fab
                        size="medium"
                        color="primary"
                        aria-label="view report"
                        title="Table view" 
                        variant='extended'
                        >
                        <TableViewIcon />
                        <Typography component='h6'>Listed Crimes</Typography>
                    </Fab>
                }
            </BoxButtonStyle>
            {!hidden ?(
                        <Card>
                            <SearchInTable searchByParam={setSearchByParam} />
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Location</TableCell>
                                            <TableCell align="left">Crime</TableCell>
                                            <TableCell align="left">Specific Crime</TableCell>
                                            {admin&&<TableCell align="left">Reporter</TableCell>}
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="left">Created At</TableCell>
                                            {/* <TableCell align="right">Action</TableCell> */}
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {reports.data && reports.data.map((report) => (
                                            <TableRow key={report.id}>
                                            <TableCell component="th" scope="row">{report.location}</TableCell>
                                            <TableCell align="left">{report.crime.name}</TableCell>
                                            {admin&&<TableCell align="left">{report.specific_crime.name}</TableCell>}  
                                            <TableCell align="left">{report.user.name}</TableCell>                  
                                            <TableCell align="left">
                                                <ActiveInactiveButton 
                                                
                                                status={report.status}
                                                >
                                                {report.status ? "Active" : "Inactive"}
                                                </ActiveInactiveButton>
                                            </TableCell>
                                            <TableCell align="left">{fDateTime(report.created_at)}</TableCell>
                                            
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={recordPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    component="div"
                                    count={reports.total}
                                    rowsPerPage={reports.per_page}
                                    page={reports.current_page - 1}
                                    onPageChange={handlePageChange}
                                />
                        </Card>
                    )
                    : (
                        <>
                        <SearchFilter viewportPosition={viewportPosition} />
                        
                        <Drawer
                            anchor="left"
                            open={detailToggleState}
                            onClose={() => detailToggleDrawer(false)}
                            sx={{ "& .MuiDrawer-paper" : {
                                
                                [theme.breakpoints.down('md')]: {
                                    width:'85%',
                                },
                            }}}
                        >
                            <OuterPaperStyle>
                                <Stack spacing={3}>
                                    <Typography component="h4" color="text.secondary">Address: </Typography>
                                    <Typography variant="h5" component="h5" sx={{marginTop:'0px !important'}}>
                                        { reportDetail && reportDetail.location }
                                    </Typography>
                                    <Box>
                                        <img style={{
                                            width: '50px',
                                            paddingRight: '8px',
                                            paddingTop: '4px',
                                            float: 'left'
                                        }}
                                        alt=""
                                            src={reportDetail && process.env.REACT_APP_API_URL + '/' + reportDetail.crime.icon_3d} />
                                        <Typography variant="h6" component="h6">
                                            {reportDetail && reportDetail.crime.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                            {reportDetail && reportDetail.specific_crime.name}
                                        </Typography>
                                    </Box>
                                    <Typography component="h4" color="text.secondary">Description: <span style={{color: "#999999", fontSize: "13px", float: "right"}}>{reportDetail && printDate(reportDetail.created_at)}</span></Typography>
                                    <Typography variant="body2" sx={{marginTop:'0px !important'}}>                            
                                        {reportDetail && reportDetail.description}
                                    </Typography>
                                    <Box>
                                        <Typography component="h4" color="text.secondary">Images & Attachments: </Typography>
                                        {(reportDetail&&reportDetail?.report_images) ? reportDetail.report_images.map((image, index) => (
                                            
                                            image&&image?.path!==null&&image.path !== '' && (image.path.toString().endsWith("png") || image.path.toString().endsWith("jpeg") || image.path.toString().endsWith("jpg")) ? (
                                                <ImageList width="100%" src={image.path} key={index} />
                                            ) : (
                                                <video className="VideoInput_video" width="60%" height="auto" controls src={image.path ? image.path : 'no video'} />
                                            )
                                            
                                        )) : 
                                            <ImageList src={process.env.REACT_APP_API_URL + '/assets/image/no-image.jpg'} />
                                        }                            
                                    </Box>
                                </Stack>
                            </OuterPaperStyle>
                        </Drawer>

                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={newViewport.lng == 0 ? position : newViewport}
                            zoom={7}
                            options={mapSettings}
                        >
                            {reports.data && reports.data.map((report, index) => (
                                <Marker key={index}
                                    position={{
                                        lat: Number(report.latitude),
                                        lng: Number(report.longitude)
                                    }}
                                    icon={process.env.REACT_APP_API_URL + '/' + report.crime.icon_3d}
                                    onClick={() => { reportDetails(report) }}

                                />
                            ))}

                        </GoogleMap>
                        </>

                        
                    )
            }
            
        </>
    )
}

export default ViewReportMap;