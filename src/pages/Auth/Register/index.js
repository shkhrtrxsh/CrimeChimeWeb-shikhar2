import * as Yup from 'yup';
import "yup-phone";
import { useReducer, useState } from 'react';
import { useNavigate, Link as RouterLink} from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useDispatch } from 'react-redux';
import { register } from 'src/store/api/auth';
// @mui
import { Link, Stack, Container, Typography, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../../../components/Page';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { initial } from 'lodash';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const PaperStyle = styled(Card)(({ theme }) => ({  
  padding:'.5rem',
  '& .MuiPaper-root.MuiPaper-elevation':{
    boxShadow : 'none'
  }
}));

const HeaderStyle = styled('div')(({ theme }) => ({
  margin: '2rem 2rem .6rem 2rem'
}));

const initialErrorState = {
  name: '',
  email: '',
  phone: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SETTER":
      return {...state,...action.payload}
    case "CLEAR":
      return initialErrorState;
    default:
      return state;
  }
};


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().matches("^[0-9]*$", 'Phone number is not valid').required('Phone number is required').min(10, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
    name: Yup.string().required('Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
  };

  const [errors,dispatchError] = useReducer(reducer,initialErrorState);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (formValue) => {
    dispatch(register({formValue, navigate,dispatchError}))
  };

  return (
    <Page title="Register">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <PaperStyle>
              <HeaderStyle>
                <Typography variant="h4">
                  Sign up for Crime report
                </Typography>
                <Typography variant="p">
                  Your details are kept anonymous and will never be disclosed.
                </Typography>
              </HeaderStyle>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Name (Will not be displayed publicly)" errorOther={errors?.name} />
                  <RHFTextField name="email" label="Email Address" errorOther={errors?.email} />
                  <RHFTextField 
                    name="phone" 
                    label="Phone Number"
                    errorOther={errors?.phone}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Send OTP
                  </LoadingButton>
                </Stack>
              </FormProvider>
              <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
                Have an account?{' '}
                <Link variant="subtitle2" to="/login" component={RouterLink} style={{
                    color: theme.palette.primary.main,
                    textDecorationColor: theme.palette.primary.main,
                  }}>
                  Login
                </Link>
              </Typography>
            </PaperStyle>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
