import { styled } from '@mui/material/styles';
import {
    Button,  
} from '@mui/material';
import Iconify from 'src/components/Iconify';

export default function SaveButton(props) {
  return (
    <Button 
        variant="contained" 
        startIcon={<Iconify icon="fluent:save-28-regular" />}
        size="large"
        {...props}
    />
  );
}