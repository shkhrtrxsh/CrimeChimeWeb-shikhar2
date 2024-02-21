import * as Yup from 'yup';
import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import  API from "../../../config/api";

import { useSelector, useDispatch } from 'react-redux';
import { addUser } from 'src/store/api/user';
import { getRoles } from 'src/store/api/role';
import { addCorUser,addAdminUser } from 'src/store/api/corporateUser';
import { SaveButton } from 'src/components/Button'
import { slugConvertor } from 'src/helpers/StringHelper';
import Iconify from 'src/components/Iconify';

// @mui
import {
  Grid,
  IconButton, 
  InputAdornment,
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
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator'

import { FormProvider, RHFTextField } from 'src/components/hook-form';
// ----------------------------------------------------------------------

// ... (existing imports)

export default function AddUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState([]);
  const [cor_id, setcor_id] = useState([]);
  const { roles } = useSelector((state) => ({ ...state.role }));
  const [listcorporates, setUserData] = useState({});

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('User is required'),
    email: Yup.string().required('E-mail is required'),
  });

  const getGiHubUserWithAxios = async () => {
    const response = await API.get("/corporateList");
    setUserData(response.data);
  };

  useEffect(() => {
    dispatch(getRoles({}));
    getGiHubUserWithAxios();
  }, []);

  const handleChangeCor = (event) => {
    const {
      target: { value },
    } = event;

    setcor_id(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    if (value === "User") {
      setcor_id('');
    }
    setUserRole(typeof value === 'string' ? value.split(',') : value);
  };

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formValue) => {
    formValue.slug = slugConvertor(formValue.name);
    formValue.user_roles = userRole;

    if (userRole.includes("Corp/Group User")) {
      formValue.cor_id = cor_id;
      dispatch(addCorUser({ formValue, navigate }));
    } else {
      dispatch(addAdminUser({ formValue, navigate }));
    }
  };

  const breadcrumbNavigate = [
    {
      name: "user",
      link: "/user",
    },
  ];

  return (
    <Fragment>
      <BreadcrumbNavigator navigate={breadcrumbNavigate} currentPage="Add User" />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFTextField name="name" label="Name" />
          </Grid>
          <Grid item xs={7}>
            <RHFTextField name="email" label="E-mail Address" type="email" />
          </Grid>
          <Grid item xs={5}>
            <RHFTextField name="phone" label="Mobile" />
          </Grid>

          <Grid item xs={7}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="demo-multiple-checkbox-label" color="form">
                Select User Roles
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                color="form"
                value={userRole}
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
                    <Checkbox checked={userRole.indexOf(role.name) > -1} color="form" />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {userRole.includes("Corp/Group User") && (
            <Grid item xs={7}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-checkbox-label" color="form">
                  Select Corporate
                </InputLabel>
                {listcorporates !== undefined && listcorporates.data ? (
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    color="form"
                    value={cor_id}
                    onChange={handleChangeCor}
                    input={<OutlinedInput label="Select Corporate" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {listcorporates.data.map((corporate) => (
                          cor_id === corporate.id ? <Chip key={corporate.id} label={corporate.name} /> : ''
                        ))}
                      </Box>
                    )}
                  >
                    {listcorporates.data.map((corporate) => (
                      <MenuItem key={corporate.name} value={corporate.id}>
                        <Checkbox checked={cor_id === corporate.id} color="form" />
                        <ListItemText primary={corporate.name} />
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  ''
                )}
              </FormControl>
            </Grid>
          )}

          <Grid item xs={7}>
            <SaveButton type="submit">Save</SaveButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Fragment>
  );
}
