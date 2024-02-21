import React, { useEffect } from 'react';
import * as Yup from 'yup';
import "yup-phone";
import { useNavigate} from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SaveButton } from 'src/components/Button'

import { useSelector, useDispatch } from 'react-redux';
import { showAuthUser, updateUser } from 'src/store/api/user';
import { Container, Grid } from '@mui/material'
import UserSideName from './components/UserSideNav';
import Page from '../../../components/Page';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import AvatarUpload from 'src/components/AvatarUpload';

const EditProfile = () => {  
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => ({ ...state.user }));
    const phoneRegExp = new RegExp('[0-9]{10}');
  
    const LoginSchema = Yup.object().shape({
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      name: Yup.string().required('Username is required'),
      email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    });
  
    const defaultValues = {
      name: '',
      email: '',
      phone: '',
      files: ''
    };
  
    const methods = useForm({
      resolver: yupResolver(LoginSchema),
      defaultValues,
    });
  
    const {
      handleSubmit,
      formState: { isSubmitting },
      setValue
    } = methods;
  
    const onSubmit = (formValue) => {
      dispatch(updateUser({formValue, navigate}))
    };

    useEffect(() => {
        dispatch(showAuthUser({}))
    }, [])

    useEffect(() => {
        if(user != null){
            setValue('name', user.name)
            setValue('email', user.email)
            setValue('username', user.username)
            setValue('phone', user.phone)
        }
    }, [user])

    const addFileHandler = (files) => {
        setValue('files', files)
    }
  

    return (
        <Page title="Edit Profile">
            <Container sx={{
                marginTop: '20px'
            }}>
                <Grid container spacing={3}>
                    <UserSideName />
                    <Grid item md={9} xs={12}>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={4}>
                                <Grid item md={9} xs={12}>
                                    <AvatarUpload addFiles={addFileHandler} preview={user && process.env.REACT_APP_API_URL + '/' + user.avatar}/>
                                </Grid>
                                <Grid item md={9} xs={12}>
                                    <RHFTextField name="name" label="Name" />
                                </Grid>
                                <Grid item md={9} xs={12}>
                                    <RHFTextField name="email" label="E-mail Address" />
                                </Grid>
                                <Grid item md={9} xs={12}>
                                    <RHFTextField name="username" label="Username" disabled/>
                                </Grid>
                                <Grid item md={9} xs={12}>
                                    <RHFTextField name="phone" label="Phone Number" disabled/>
                                </Grid>
                                <Grid item md={7} xs={12}>
                                    <SaveButton type="submit">
                                        Save
                                    </SaveButton>
                                </Grid>
                            </Grid>                        
                        </FormProvider>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default EditProfile
