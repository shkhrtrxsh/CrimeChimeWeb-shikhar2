import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { addNote ,get_note } from 'src/store/api/report';
// @mui
import {
  Stack,
  Container,
  Typography,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
} from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useEffect, Fragment ,useState} from 'react';
import { SaveButton } from 'src/components/Button'
import { slugConvertor } from 'src/helpers/StringHelper';
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator'
import  API from "src/config/api";
// ----------------------------------------------------------------------

export default function AddNote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [value, setValue]= useState({});
  const RoleSchema = Yup.object().shape({
    note: Yup.string().required('Note is required'),
  });

  const { note } = useSelector((state) => ({ ...state.get_note }));

    useEffect(() => {
        const fetchUserInfo = async () => {
          const response = await API.get("/report/get_note/"+id);
          if(response.status === 200){
            setValue(response.data);
            // console.log(response);
          }
          
        }
        fetchUserInfo()
    }, [])

  const defaultValues = {
    note: '',
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    id = params.id,
    formState: { isSubmitting },
    
  } = methods;

  const onSubmit = (formValue) => {
    dispatch(addNote({formValue,id, navigate}))
  };

  const breadcrumbNavigate = [
    {
      name : "reports",
      link :  "/reports"
    }
  ]
  return (
    <Fragment >
      <BreadcrumbNavigator 
        navigate={breadcrumbNavigate} 
        currentPage="Add/Show Note"
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <RHFTextField name="note" label="Add note" />
        </Grid>
        <Grid item xs={6}>
          <SaveButton type="submit">
            Save
          </SaveButton>
        </Grid>
      </Grid>
      </FormProvider>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { value && value?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item?.note}</TableCell>
                <TableCell>{new Date(item?.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{jwtDecode(item?.user?.name).name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
