import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, alpha } from "@mui/material/styles";
import { showCorporate, deleteUser, userStatus } from "src/store/api/corporate";
import { ActiveInactiveButton, LinkButton } from "src/components/Button";
import ActionOptions from "src/components/ActionOptions";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDeleteDialog from "src/components/ConfirmDeleteDialog";
import ChangeStatusDialog from "src/components/ChangeStatusDialog";
import Iconify from "src/components/Iconify";
import palette from "src/theme/palette";
import BreadcrumbNavigator from "src/components/BreadcrumbNavigator";
import {
  getSearchQueryParams,
  setSearchQueryParams,
  recordPerPage,
} from "src/helpers/SearchHelper";
import { jwtDecode } from "jwt-decode";
import API from 'src/config/api';
import { toast } from 'react-toastify';

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
  Typography,
  Card,
  FormControl,
  Select, 
  MenuItem,
} from "@mui/material";
import { SearchInTable } from "src/components/Table";
import corporate from "src/store/reducers/corporate";


export default function CorporateList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [openDialog, setOpenDialog] = useState({
    status: false,
    id: null,
  });
  const [changeStatusDialog, setChangeStatusDialog] = useState({
    status: false,
    id: null,
    condition: null,
  });
  const [industryType,setindustryTypeList] = useState([])
  const [industryTypeId,setindustryTypeId] = useState('')

  const corporateData = useSelector((state) => state?.corporate?.data);
  
  useEffect(() => {
    dispatch(showCorporate({}));
    
  }, []);
  useEffect(()=>{
    getindustryType()
  },[])

  const callDeleteFunc = (status, id) => {
    if (status === true) {
      dispatch(deleteUser({ id }));
    }
  };

  const changeStatusFunc = (status, id, condition) => {
    if (status === true) {
      const formValue = {
        id: id,
        status: condition,
      };
      dispatch(userStatus({ formValue }));
    }
  };

  const deleteOptionAction = (event) => {
    setOpenDialog((prevState) => ({
      ...prevState,
      status: event.status,
      id: event.id,
    }));
  };

  const handlePageChange = (event, onPage) => {
    let param = setSearchQueryParams(searchParams, onPage);
    navigate(`/corporate?${param}`);
  };

  const handleChangeRowsPerPage = (event) => {
    let param = setSearchQueryParams(searchParams, 0, event.target.value);
    navigate(`/corporate?${param}`);
  };

  const setSearchByParam = async (id) => {
    dispatch(showCorporate({id}));
    setindustryTypeId(id);
  }

  const getindustryType = async () => {
    const response = await API.get("/listIndustryType")
    if(response.data.code == 200){
      setindustryTypeList(response.data.data)
    }else{
      toast.error(response.data.message,{
        toastId:'lsooo'
      })
    }
  }

  return (
    <Fragment>
      <BreadcrumbNavigator
        currentPage="Corporates/Groups"
        rightButton={{ name: "add Corporate", link: "/corporate/add" }}
      />
      <Card>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" color="form">
        <Select
          value={industryTypeId}
          onChange={(e) => { setSearchByParam(e.target.value) }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{maxHeight:"250px",overflowX:"auto"}}
        >
          <MenuItem value="" >All Industry</MenuItem>
          {industryType?.map((item,index)=><MenuItem key={index} value={item.id}>{item.name}</MenuItem>)}
        </Select>
      </FormControl>
        {/* <SearchInTable searchByParam={setSearchByParam}/> */}
        <TableContainer component={Paper} style={{}}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell size="small" style={{ padding: '8px' }}>Corp./Group Name</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Address</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Corp./Group Admin</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Mobile Number</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Email</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Industry Types</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Logo</TableCell>
        <TableCell align="left" size="small" style={{ padding: '8px' }}>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {corporateData &&
        corporateData.map((cor) => (
          <TableRow key={cor.id}>
            <TableCell component="th" scope="row" size="small" style={{ padding: '8px' }}>
              {cor.name}
            </TableCell>
            <TableCell align="left" size="small" style={{ padding: '8px' }}>{cor.address}</TableCell>
            <TableCell align="left" size="small" style={{ padding: '8px' }}>{cor.cor_admin?.name && jwtDecode(cor.cor_admin?.name).name}</TableCell>
            <TableCell align="left" size="small" style={{ padding: '8px' }}>{cor.cor_admin?.phone && jwtDecode(cor.cor_admin?.phone).phone}</TableCell>
            <TableCell align="left" size="small" style={{ padding: '8px' }}>{cor.cor_admin?.email && jwtDecode(cor.cor_admin?.email).email}</TableCell>
            <TableCell align="left" size="small" style={{ padding: '8px' }}>{cor.industry?.name}</TableCell>
            <TableCell align="left" style={{ padding: '8px' }}>
              <img
                src={cor.logo}
                style={{
                  height: "30px",
                  width: "30px",
                  border: "2px solid #333",
                  borderRadius: "50%",
                  float: "right",
                }}
                alt="No Data Available"
              />
            </TableCell>
            <TableCell align="right" style={{ padding: '8px' }}>
              <ActionOptions
                edit_url={"/Corporate/" + cor.id}
                deleteAction={deleteOptionAction}
              />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
</TableContainer>

        {/* <TablePagination
          rowsPerPageOptions={recordPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          component="div"
          count={corporateData?.total}
          rowsPerPage={corporateData?.per_page}
          page={corporateData?.current_page - 1}
          onPageChange={handlePageChange}
        /> */}
      </Card>
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
    </Fragment>
  );
}
