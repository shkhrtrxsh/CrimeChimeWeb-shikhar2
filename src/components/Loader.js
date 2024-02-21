import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <Stack sx={{ height: '60vh'}}>
      <CircularProgress sx={{margin:'auto'}} color="primary" />
    </Stack>
  );
}