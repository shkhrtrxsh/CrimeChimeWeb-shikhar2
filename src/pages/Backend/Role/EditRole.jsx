import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector, useDispatch } from 'react-redux';
import { editRole, showRole } from 'src/store/api/role';
// @mui
import {  
  Stack, 
  Container,
  Typography,
  Button,
  Grid
} from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useEffect, Fragment } from 'react';
import { SaveButton } from 'src/components/Button'
import { slugConvertor } from 'src/helpers/StringHelper';
import BreadcrumbNavigator from 'src/components/BreadcrumbNavigator'

// ----------------------------------------------------------------------

export default function EditRole() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const RoleSchema = Yup.object().shape({
    name: Yup.string().required('Role is required'),
    slug: Yup.string().required('Slug is required')
  });

  const { role } = useSelector((state) => ({ ...state.role }));

  useEffect(()=>{
    const id = params.id
    dispatch(showRole({id}))
  }, [params])

  useEffect(()=>{
    if(role !== null){
      setValue("id", role.id)
      setValue("name", role.name)
      setValue("slug", role.slug)
    }
  }, [role])

  const defaultValues = {
    name: '',
    slug: ''
  };

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = methods;

  const onSubmit = (formValue) => {
    formValue.slug = slugConvertor(formValue.slug)
    dispatch(editRole({formValue, navigate}))
  };

  const breadcrumbNavigate = [
    {
      name : "role",
      link :  "/role"
    }
  ]

  return (
    <Fragment >
      <BreadcrumbNavigator 
        navigate={breadcrumbNavigate} 
        currentPage="Edit Role"
      />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <RHFTextField name="name" label="Role" />
        </Grid>
        <Grid item xs={7}>
          <RHFTextField name="slug" label="Slug" />
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
