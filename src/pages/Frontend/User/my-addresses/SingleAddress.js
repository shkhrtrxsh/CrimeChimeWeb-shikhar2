import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {  deleteReport, reportStatus } from 'src/store/api/report';
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
import API from 'src/config/api';
import { fDateTime } from 'src/utils/formatTime';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ActiveInactiveButton } from 'src/components/Button';
import ActionOptions from 'src/components/ActionOptions'
import ConfirmDeleteAddress from 'src/components/ConfirmDeleteAddress';
import ChangeStatusDialog from 'src/components/ChangeStatusDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function SingleAddress({report,formattedLatitude,formattedLongitude,index,handler}) {
    const [toggle,setToggle] = useState(report.is_approve == '1' ? true : false)
    const dispatch = useDispatch();
    const [show,setShow] = useState(report.is_show == '1' ? true : false)
    const [openDialog, setOpenDialog] = useState({
        status: false,
        id: null
    });
    const [changeStatusDialog, setChangeStatusDialog] = React.useState({
        status: false,
        id: null,
        condition: null
    });
    const navigate = useNavigate();
    const handleChange = async () => {
        const val = toggle;
        setToggle(p=>!p);
        const formValue = {
            id:report.id,
            is_approve: !val ? 1:0
        }
        const response = await API.post(`/setReportApproved`,formValue);
    };
    const callDeleteFunc = async(status, id) => {
        if (status === true) {
            const response = await API.get(`/deleteAddress/${id}`);
            if(response.data.success){
                toast.success("Address deleted",{
                    toastId:'dkjdjk'
                })
                setOpenDialog((prevState) => ({
                    ...prevState,
                    id: report.id,
                    status:false,
                }));
                handler();
            }else{
                toast.error(response.data.message,{
                    toastId:"jbdbnb"
                })
            }
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
            is_approve: !val ? 1:0
        }
        const response = await API.post(`/setShowReport`,formValue);
    };
    const editHandler = () => {
        navigate(`/my-addresses/edit/${report.id}`)
    }
    const deleteHandler = () => {
        setOpenDialog((prevState) => ({
            ...prevState,
            id: report.id,
            status:true,
        }));
    }
  return (
    <>
        <TableRow>
            <TableCell align="left">{report.name_location}</TableCell>
            <TableCell component="th" scope="row" align='left'  >{report.address}<br></br>{formattedLatitude} S,<br></br>{formattedLongitude} E</TableCell>
            <TableCell align="left">{fDateTime(report.created_at)}</TableCell>
            <TableCell align="center" >
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <div className='cursor-pointer row d-align-center' onClick={editHandler}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_26_877)">
                        <path d="M9.16602 1.66667H7.49935C3.33268 1.66667 1.66602 3.33334 1.66602 7.5V12.5C1.66602 16.6667 3.33268 18.3333 7.49935 18.3333H12.4993C16.666 18.3333 18.3327 16.6667 18.3327 12.5V10.8333" stroke="#FFC960" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.3675 2.51666L6.80088 9.08333C6.55088 9.33333 6.30088 9.825 6.25088 10.1833L5.89254 12.6917C5.75921 13.6 6.40088 14.2333 7.30921 14.1083L9.81754 13.75C10.1675 13.7 10.6592 13.45 10.9175 13.2L17.4842 6.63333C18.6175 5.5 19.1509 4.18333 17.4842 2.51666C15.8175 0.849997 14.5009 1.38333 13.3675 2.51666Z" stroke="#FFC960" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.4258 3.45833C12.7021 4.43955 13.2258 5.33338 13.9466 6.0542C14.6674 6.77502 15.5612 7.29867 16.5424 7.575" stroke="#FFC960" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_26_877">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className='cursor-pointer row d-align-center' onClick={deleteHandler}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Iconsax/Linear/bag">
                        <path id="Vector" d="M8.80945 2L5.18945 5.63M15.1895 2L18.8095 5.63" stroke="#FF6666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path id="Vector_2" d="M2 7.85001C2 6.00001 2.99 5.85001 4.22 5.85001H19.78C21.01 5.85001 22 6.00001 22 7.85001C22 10 21.01 9.85001 19.78 9.85001H4.22C2.99 9.85001 2 10 2 7.85001Z" stroke="#FF6666" strokeWidth="1.5"/>
                        <path id="Vector_3" d="M9.76 14V17.55M14.36 14V17.55M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="#FF6666" strokeWidth="1.5" strokeLinecap="round"/>
                        </g>
                    </svg>
                </div>
                </div>
                {/* <ActionOptions
                    index={index}
                    delete_id={report.id}
                    show_url={'/my-addresses?=single&id=' + report.id}
                    // add_note={'/add_not/' + report.id}
                    deleteAction={(event) => {
                        // handler(event.status,event.id)
                        setOpenDialog((prevState) => ({
                            ...prevState,
                            id: event.id
                        }));
                        deleteHandler()
                    }}
                /> */}
            </TableCell>                               
        </TableRow>
        <ConfirmDeleteAddress
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
