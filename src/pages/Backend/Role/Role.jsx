import React, { Fragment, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRoles, deleteRole, roleStatus} from 'src/store/api/role';
import { ActiveInactiveButton, LinkButton } from 'src/components/Button';
import ActionOptions from 'src/components/ActionOptions'
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmDeleteDialog from 'src/components/ConfirmDeleteDialog'
import ChangeStatusDialog from 'src/components/ChangeStatusDialog';
import Iconify from 'src/components/Iconify';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  Card
} from '@mui/material';
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator';
import {SearchInTable} from 'src/components/Table';
import { getSearchQueryParams, setSearchQueryParams, recordPerPage } from 'src/helpers/SearchHelper';

export default function Role() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openDialog, setOpenDialog] = React.useState({
    status: false, 
    id: null 
  });
  const [changeStatusDialog, setChangeStatusDialog] = React.useState({
    status: false, 
    id: null,
    condition: null
  });

  const { roles } = useSelector((state) => ({ ...state.role }));

  useEffect(() => {
    const param = getSearchQueryParams(searchParams)
    dispatch(getRoles({param}))
  },[searchParams]);

  const callDeleteFunc = (status, id) => {
    if(status === true){
      dispatch(deleteRole({id}))
    }
  }

  const changeStatusFunc = (status, id, condition) => {    
    if(status === true){
      const formValue = {
        id : id,
        status: condition
      }
      dispatch(roleStatus({ formValue }))

    }
  }

  const deleteOptionAction = (event) => {
    setOpenDialog((prevState) => ({
      ...prevState,
      status: event.status,
      id:event.id
    }));
  }

  const handlePageChange = (event, onPage) => {
    let param = setSearchQueryParams(searchParams, onPage)
    navigate(`/role?${param}`)
  }

  const handleChangeRowsPerPage = (event) => {
    let param = setSearchQueryParams(searchParams, 0, event.target.value)
    navigate(`/role?${param}`)
  }

  const setSearchByParam = (param) => {
    navigate(`/role?${param}`)
  }

  return (
    <Fragment>
      <BreadcrumbNavigator
        currentPage="Role List" 
        rightButton={{name: "add role", link: "/role/add"}} 
      />
      <Card>
        <SearchInTable searchByParam={setSearchByParam} />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell align="left">Slug</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.data && roles.data.map((role) => (
                <TableRow key={role.id}>
                  <TableCell component="th" scope="row">{role.name}</TableCell>
                  <TableCell align="left">{role.slug}</TableCell>
                  <TableCell align="left">
                    <ActiveInactiveButton 
                      onClick={() => setChangeStatusDialog({ status: true, id: role.id })}
                      status={role.status}
                    >
                      {role.status ? "Active" : "Inactive"}
                    </ActiveInactiveButton>
                  </TableCell>
                  <TableCell align="right">
                    <ActionOptions 
                      delete_id={role.id} 
                      edit_url={`/role/${role.id}/edit`} 
                      deleteAction={deleteOptionAction}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={recordPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          component="div"
          count={roles.total}
          rowsPerPage={roles.per_page}
          page={roles.current_page - 1}
          onPageChange={handlePageChange}
        />
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
