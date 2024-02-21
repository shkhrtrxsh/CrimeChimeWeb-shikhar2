import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from 'src/store/api/user';
import { corporateCount } from 'src/store/api/corporate';

import { useNavigate } from 'react-router-dom';
import Page from '../../../components/Page';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../../../sections/@dashboard/app';// Assuming you have this component
import API from 'src/config/api';
export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state.user }));
  const [corporate,setCorporate] = useState('')
  const getCorporatesData = async () => {
    const response = await API.get(`/corporateCount`);
    setCorporate(response.data.data)
  }

  useEffect(() => {
    dispatch(dashboard({}));
    getCorporatesData();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5, mt:4, display:'flex',justifyContent:"center" }}>
          Administrative Dashboard
        </Typography>
        {user ? (
          <Grid container spacing={3}>
            {/* Users Section */}
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant='h4'>Users</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/user')}>
              <AppWidgetSummary title="Registered Users" total={user.user ? user.user.total : 0} icon={'mdi:user'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/user')}>
              <AppWidgetSummary title="Active Users" total={user.user ? user.user.active : 0} icon={'mdi:user'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/user')}>
              <AppWidgetSummary title="Inactive Users" total={user.user ? user.user.inactive : 0} icon={'mdi:user'} />
            </Grid>

            {/* Corporate/Groups Section */}
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant='h4'>Corporate/Groups</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/corporate')}>
              <AppWidgetSummary title="Corporates/Groups" total={corporate ? corporate.corporateCount : 0} icon={'mdi:user'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/corporate')}>
              <AppWidgetSummary title="Industry Type" total={corporate ? corporate.industryCount : 0} icon={'mdi:user'} />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={4} onClick={() => handleCardClick('/corporate')}>
              <AppWidgetSummary title="Inactive Groups" total={user.user ? user.user.inactive : 0} icon={'mdi:user'} />
            </Grid> */}

            {/* Reports Section */}
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant='h4'>Reports</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/reports')}>
              <AppWidgetSummary title="Reported Crimes" total={user.user ? user.report.total : 0} icon={'mdi:user'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/reports')}>
              <AppWidgetSummary title="Active Report" total={user.user ? user.report.active : 0} icon={'mdi:user'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{cursor:"pointer"}} onClick={() => handleCardClick('/reports')}>
              <AppWidgetSummary title="Inactive Report" total={user.user ? user.report.inactive : 0} icon={'mdi:user'} />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Container>
    </Page>
  );
}
