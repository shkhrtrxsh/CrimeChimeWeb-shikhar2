import * as Yup from 'yup';
import { Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector, useDispatch } from 'react-redux';
import { editUser, showUser } from 'src/store/api/user';
import { getRoles } from 'src/store/api/role';
import { slugConvertor } from 'src/helpers/StringHelper';
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator'
// @mui
import {
  Grid,
  InputLabel,
  Select,
  Box,
  OutlinedInput,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
  Chip
} from '@mui/material';
// components
import { FormProvider, RHFTextField, } from 'src/components/hook-form';
import { useEffect, useState } from 'react';
import { SaveButton } from 'src/components/Button'
// ----------------------------------------------------------------------

export default function EditUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [userRole, setUserRole] = useState([]);
  const { user } = useSelector((state) => ({ ...state.user }));
  const { roles } = useSelector((state) => ({ ...state.role }));

  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    setUserRole(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('User is required'),
    email: Yup.string().required('Email is required'),
    mobile: Yup.string().required('Mobile is required')
  });

  useEffect(()=>{
    const id = params.id
    dispatch(showUser({id}))
  }, [params])

  useEffect(()=>{
    if(user !== null){
      setValue("id", user.id)
      setValue("name", user.name)
      setValue("email", user.email)
      setValue("mobile", user.mobile ?? '')
      dispatch(getRoles({}))
      const value = [];
      user.roles.forEach(element => {          
        value.push(element.name);
      });
      setUserRole(value);
    }
  }, [user])

  const defaultValues = {
    name: '',
    email: '',
    mobile: ''
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = methods;

  const onSubmit = (formValue) => {
    formValue.slug = slugConvertor(formValue.slug)
    dispatch(editUser({formValue, navigate}))
  };

  const breadcrumbNavigate = [
    {
      name : "user",
      link :  "/user"
    }
  ]

  return (
    <Fragment>
      <BreadcrumbNavigator 
        navigate={breadcrumbNavigate} 
        currentPage="Edit User"
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <RHFTextField name="name" label="Name" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="email" label="E-mail Address" />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name="mobile" label="Mobile" />
          </Grid>
          <Grid item xs={7}>
            <FormControl sx={{width:'100%'}}>
              <InputLabel id="demo-multiple-checkbox-label" color="form">Select User Roles</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={userRole}
                color="form"
                onChange={handleChangeRole}
                input={<OutlinedInput label="Select User Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {roles.data && roles.data.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    <Checkbox checked={userRole.indexOf(role.name) > -1} color="form"/>
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={7}>
            <SaveButton type="submit">
              Save
            </SaveButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Fragment>
  );
}
