import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {  getReports,deleteReport, reportStatus, showReportStatus, reportApproved } from 'src/store/api/report';
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
    Typography,
    ToggleButton,
    ToggleButtonGroup,
  } from '@mui/material';
import redEye from '../../../assets/images/red eye.png'
import greenEye from '../../../assets/images/green eye.png'
import API from 'src/config/api';
import { fDateTime } from 'src/utils/formatTime';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ActiveInactiveButton } from 'src/components/Button';
import ActionOptionsTwo from 'src/components/ActionOptionsTwo';
import ConfirmDeleteDialog from 'src/components/ConfirmDeleteDialog'
import ChangeStatusDialog from 'src/components/ChangeStatusDialog';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
export default function SingleReport({report,formattedLatitude,formattedLongitude,index,handler,refresh}) {
    
    const phonee = jwtDecode(report?.user?.phone).phone
    const [toggle,setToggle] = useState(parseInt(report.is_approve) == 1 ? true : false)
    const dispatch = useDispatch();
    const [show,setShow] = useState(parseInt(report.is_show) == 1 ? true : false)
    const [openDialog, setOpenDialog] = useState({
        status: false,
        id: null
    });
    const [changeStatusDialog, setChangeStatusDialog] = React.useState({
        status: false,
        id: null,
        condition: null
    });
    const { reports,error } = useSelector((state) => ({ ...state.report }));

    const handleChange = async () => {
        const val = toggle;
        setToggle(p=>!p);
        const formValue = {
            id:report.id,
            is_approve: !val ? 1:0
        }
        dispatch(reportApproved({ formValue }))
        refresh();

        // const response = await API.post(`/setReportApproved`,formValue);
        // if(response.data.code == 200){
        //     toast.success(response.data.message,{
        //         toastId:'skjdjj'
        //     })
        //     // window.location.reload();

        // }
    };
    const callDeleteFunc = (status, id) => {
        if (status === true) {
          dispatch(deleteReport({ id }))
        }
    }
    
    const changeStatusFunc = (status, id, condition) => {
        if (status === true) {
          const formValue = {
            id: id,
            status: condition
          }
          dispatch(reportStatus({ formValue }))
        }
    }
    const showHandler = async () => {
        const val = show;
        setShow(p=>!p);
        const formValue = {
            id:report.id,
            showHide: !val ? 1:0
        }
        dispatch(showReportStatus({ formValue }))
        refresh();
        // const response = await API.post(`/setShowReport`,formValue);
        // if(response.data.code == 200){
        //     toast.success(response.data.message,{
        //         toastId:'skjdjj'
        //     })
        //     // window.location.reload();
        // }
        
    };
    useEffect(()=>{
        dispatch(getReports())
    },[toggle,show])
  return (
    <>
        <TableRow>
            <TableCell>
            <ToggleButtonGroup
                color="success"
                value={toggle}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value={true}>Yes</ToggleButton>
                <ToggleButton value={false}>No</ToggleButton>
            </ToggleButtonGroup>
            </TableCell>
            <TableCell align="left">{fDateTime(report.date_time)}</TableCell>
            <TableCell component="th" scope="row">{report.location}<br></br>{formattedLatitude} S,<br></br>{formattedLongitude} E</TableCell>
            <TableCell align="left">
            {report.robbery != 0 ? (<>Robbery,<br /></>) : null}
            {report.murders != 0 ? (<>Murders,<br /></>) : null}
            {report.burglary !=0 ? (<>Burglary,<br /></>) : null}
            {report.kidnapping != 0 ? (<>Kidnapping,<br /></>) : null}
            {report.rape != 0 ? (<>Rape,<br /></>) : null}
            {report.weapons != 0 ? (<>Weapons,<br /></>) : null}
            </TableCell>
            <TableCell align="left">{phonee}</TableCell>
            <TableCell align="left">{report.user.username} ({report.user.report_count})</TableCell>
            <TableCell align="left"><div>{report.user.corporate ? report.user.corporate.name : '' }{report.user.corporate ? report.user.corporate.is_verify==1 ? <CheckBoxIcon style={{ color: "#29C250",position: "absolute" }} /> : '' : ''}</div></TableCell> 
            <TableCell align="right">
                <ActionOptionsTwo
                    report={report}
                    index={index}
                    delete_id={report.id}
                    edit_url={'/add_not/' + report.id}
                    show_url={'/crimedetails?id=' + report.id+'&show=true&type=all'}
                    map_url={'/crimedetails?id=' + report.id+'&show=false&type=all'}
                    // add_note={'/add_not/' + report.id}
                    deleteAction={(event) => {
                    setOpenDialog((prevState) => ({
                    ...prevState,
                    status: event.status,
                    id: event.id
                    }));
                    }}
                />
            </TableCell> 
            <TableCell align="center">
                {!show && <img src={redEye} style={{height:"16px",width:"24px"}} onClick={showHandler} />}
                {show && <img src={greenEye} style={{height:"16px",width:"24px"}} onClick={showHandler} />}
            </TableCell>                                
        </TableRow>
        <ConfirmDeleteDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            confirmDialog={callDeleteFunc}
        />

        <ChangeStatusDialog
            openDialog={changeStatusDialog}
            setOpenDialog={setChangeStatusDialog}
            confirmDialog={changeStatusFunc}
        />
    </>
  )
}
