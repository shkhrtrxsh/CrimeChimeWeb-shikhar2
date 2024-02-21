import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';

export default function SkeletonLoader1() {
  return (
    <Card sx={{padding:4}}>
        <Typography component="div" variant="h1"><Skeleton /></Typography>
        <Typography component="div" variant="h1"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
        <Typography component="div" variant="h4"><Skeleton /></Typography>
    </Card>
  );
}