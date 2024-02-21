import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Iconify from 'src/components/Iconify';
import { styled } from '@mui/material/styles';
// import { setCrimeIndex, setPage, setZoom, } from 'src/store/reducers/registerReport';

import { 
  Menu, 
  MenuItem, 
  IconButton, 
  ListItemIcon, 
  ListItemText,
  Box,
} from '@mui/material';
import { setCrimeIndex, setEdit, setLock, setNearbyReports, setPage } from 'src/store/reducers/registerReport';
import { useDispatch, useSelector } from 'react-redux';
import API from 'src/config/api';
import { getNearbyCrimes } from 'src/store/api/registerReport';
const LinkToEdit = styled(Link)(({ theme }) => ({
    width: '100%',
    display: 'inherit',
    color: 'inherit',
    textDecoration: 'inherit',
})
);

const ActionOptionsTwo = (props) => {
  const ref = useRef(null);
  const register = useSelector(state => state.reportRegister);
  const profile = JSON.parse(localStorage.getItem("profile"))
  const { data, zoom, nearbyData, crimeIndex } = register;
  const { longitude, latitude } = data;
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = React.useState({
    status: false, 
    id: null 
  });
  const {delete_id, edit_url, show_url,map_url, extra_url, add_note,index,report} = props;
  
  const admin = nearbyData?.admin ? true : false;
  const [permission,setPermission] = useState(0)
  const getPermissionHandler = async () => {
    const response = await API.get(`/reportPermission`)
    setPermission(response.data.data)
  }
  useEffect(() => {
    props.deleteAction(openDialog)
    setIsOpen(false)

    // getPermissionHandler();
  }, [openDialog])
  const navigate = useNavigate();
  return(
    <>
    <IconButton ref={ref} onClick={() => setIsOpen(true)}>
      <Iconify icon="eva:more-vertical-fill" />
    </IconButton>

    <Menu
      open={isOpen}
      anchorEl={ref.current}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: { width: 200, maxWidth: '100%' }
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {admin && delete_id !== undefined ? 
      <MenuItem sx={{ color: 'text.secondary' }} 
        onClick={() => setOpenDialog({ status: true, id: delete_id })}>
        <ListItemIcon>
        <Iconify icon="eva:trash-2-outline" />
        </ListItemIcon>
        <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>
      : '' }

      {edit_url !== undefined ? 
      <MenuItem sx={{ color: 'text.secondary' }}>
        <Box sx={{display:"flex"}} onClick={()=>{
          let newReport = report; 
          // const report_image=newReport.report_image
          // newReport.files=newReport.fileName=(process.env.REACT_APP_API_URL+"/"+report_image?.path)||null; 
          // newReport.report_image=null;
          //remove null values from newReport
          // const keyList = Object.keys(newReport);
          // keyList.forEach((key)=>{
          //     if((newReport[key]==null)){
          //         delete newReport.key;
          //     }
          // }) 
          dispatch(setEdit(true));
          dispatch(setPage(newReport));
          navigate("/report/add");
        // }
        }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" sx={{fontSize : 20}}/>
          </ListItemIcon>
          <ListItemText primary="Edit Crime" primaryTypographyProps={{ variant: 'body2' }} />
        </Box>
      </MenuItem>
      : '' }
      {map_url !== undefined ? 
      <MenuItem sx={{ color: 'text.secondary' }}>
        <Box sx={{display:"flex"}} >
          <LinkToEdit to={map_url}>
            <ListItemIcon>
              <Iconify icon="clarity:eye-line" sx={{fontSize : 22}} />
            </ListItemIcon>
            <ListItemText primary="View on map" primaryTypographyProps={{ variant: 'body2' }} />
          </LinkToEdit>
        </Box>
      </MenuItem>
      : '' }

      {show_url !== undefined ? 
      <MenuItem sx={{ color: 'text.secondary' }}>
        <Box sx={{display:"flex"}}>
          <LinkToEdit to={show_url}>
            <ListItemIcon>
              <Iconify icon="clarity:eye-line" sx={{fontSize : 22}} />
            </ListItemIcon>
            <ListItemText primary="See details" primaryTypographyProps={{ variant: 'body2' }} />
          </LinkToEdit>
        </Box>
      </MenuItem>
      : '' }

{profile && profile.data.role_id=="1" && (
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => navigate(`/add_note/${delete_id}`)}>
          <ListItemIcon>
            <Iconify icon="clarity:plus-line" sx={{ fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText primary="Add/Show Note" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      )}

      {extra_url !== undefined ? 
        <MenuItem sx={{ color: 'text.secondary' }}>
          <LinkToEdit to={extra_url.url}>
            <ListItemIcon>
              <Iconify icon={extra_url.icon} sx={{fontSize : 22}} />
            </ListItemIcon>
            <ListItemText primary={extra_url.name} primaryTypographyProps={{ variant: 'body2' }} />
          </LinkToEdit>
        </MenuItem>
        : '' }

      </Menu>
    </>
  )
}

export default ActionOptionsTwo;