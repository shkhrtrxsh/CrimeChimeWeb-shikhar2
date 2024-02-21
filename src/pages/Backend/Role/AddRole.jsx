import * as Yup from 'yup';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector, useDispatch } from 'react-redux';
import { addRole } from 'src/store/api/role';
import { slugConvertor } from 'src/helpers/StringHelper';
import { SaveButton } from 'src/components/Button'
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator'
// @mui
import {  
  Stack, 
  Container,
  Typography,
  Button,
  Grid
} from '@mui/material';
// components

import { FormProvider, RHFTextField, RHFCheckbox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AddRole() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role is required')
  });

  const defaultValues = {
    name: ''
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formValue) => {
    formValue.slug = slugConvertor(formValue.name)
    dispatch(addRole({formValue, navigate}))
  };

  
  const breadcrumbNavigate = [
    {
      name : "role",
      link :  "/role"
    }
  ]

  return (
    <Fragment>
      <BreadcrumbNavigator 
        navigate={breadcrumbNavigate} 
        currentPage="Add Role"
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <RHFTextField name="name" label="Role" />
        </Grid>
        <Grid item xs={6}>
          <SaveButton type="submit">
            Save
          </SaveButton>
        </Grid>
      </Grid>
      </FormProvider>
    </Fragment>
  );
}
