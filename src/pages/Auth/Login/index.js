import * as Yup from 'yup';
import "yup-phone";
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useDispatch } from 'react-redux';
import { login } from 'src/store/api/auth';
import { verifyToken } from 'src/store/api/report';
// @mui
import { Link, Stack, Container, Typography, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../../../components/Page';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
// ----------------------------------------------------------------------
import React, { useState,useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import  API from "../../../config/api";
import { toast } from "react-toastify";
import { IsAuth } from 'src/helpers/RouteHelper';
import logo from '../../../assets/images/CrimeChimeLogo.png'
import flag from '../../../assets/images/SAflag.png'
import RHFTextField2 from 'src/components/hook-form/RHFTextField2';
import FormProvider2 from 'src/components/hook-form/FormProvider2';
import RHFTextField3 from 'src/components/hook-form/RHFTextField3';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  
}));


const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  
}));

const PaperStyle = styled(Card)(({ theme }) => ({  
  padding:'.5rem',
  '& .MuiPaper-root.MuiPaper-elevation':{
    boxShadow : 'none'
  },
  backgroundColor: "black"
  
}));

const HeaderStyle = styled('div')(({ theme }) => ({
  margin: '2rem 2rem .6rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  img: {
    marginBottom: '-10px', // Set a negative margin to reduce the gap
  },
}));


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const captchaRef = useRef(null);

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().matches("^[0-9]*$", 'Phone number is not valid').required('Phone number is required').min(10, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
  });

  const defaultValues = {
    phone: '',
  };

  const methods = useForm({
    //resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formValue) => {
      // let token = captchaRef.current.getValue();

      // if(token){
      //     dispatch(verifyToken({token})).then((response)=>{
      //     if(response.payload.success == true){
            
      //     }else{
      //       toast.error("Something wrong!");
      //     }
      //   })
      // }else{
      //   toast.error("Something wrong!");
      // }
      dispatch(login({formValue, navigate}))
  };
  if (IsAuth())return <Navigate to="/"/>;
  return (
    <Page title="Login">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <PaperStyle>
              <HeaderStyle>
                <img src={logo} alt="Logo" style={{ width: '100%', maxWidth: '150px', marginBottom: '-10px' }} />
              </HeaderStyle>

              <FormProvider2 methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={0} direction="row" justifyContent="center">
                  
                  <RHFTextField2
                    name="phone" 
                    label="ZA Phone Number"
                    flagg={true}
                  />
                </Stack><br></br>
                <Stack spacing={3}>
                  {/* ... (other code remains the same) */}
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Send OTP
                  </LoadingButton>
                </Stack>
              </FormProvider2>
            </PaperStyle>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
