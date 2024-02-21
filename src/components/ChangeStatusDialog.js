import React, { useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { styled } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  IconButton
} from '@mui/material';

const NewIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 5,
    top: 5,
    wdith:40
}));

const InactiveButton = styled(Button)(({ theme }) => ({
  background: '#f71818',
  margin: '0 15px !important',
  boxShadow: 'none',
  '&:hover':{
    background: '#e21515 !important',
    boxShadow: '0px 0px 6px 0px #e21515'
  }
}));

const ActiveButton = styled(Button)(({ theme }) => ({
    background: '#00ab55',
    margin: '0 15px !important',
    boxShadow: 'none',
    '&:hover':{
      background: '#00ab55 !important',
      boxShadow: '0px 0px 6px 0px #00ab55'
    }
}));

export default function ChangeStatusDialog(props) {
  const {openDialog, setOpenDialog} = props;
  const [status, setStatus] = React.useState(false);

  const handleInactive = () => {
    setStatus(true);
    setOpenDialog((prevState) => ({
      ...prevState,
      status: false,
      condition: 0
    }));
  };

  const handleActive = () => {
    setStatus(true);
    setOpenDialog((prevState) => ({
      ...prevState,
      status: false,
      condition: 1
    }));
  }

  const handleClose = () => {
    setStatus(false);
    setOpenDialog((prevState) => ({
      ...prevState,
      status: false,
    }));
  }

  useEffect(() => {
    props.confirmDialog(status, openDialog.id, openDialog.condition)
    setStatus(false)
  }, [status])

  return (
    <div>      
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog.status}>
        <NewIconButton onClick={handleClose}>
          <Iconify icon="ic:baseline-highlight-off" />
        </NewIconButton>
        <DialogContent sx={{
          padding: '60px !important',
          textAlign: 'center'
          }}
        >
          <Typography variant="h3">
            Are you sure ?
          </Typography>
          <Typography variant="h6" sx={{
            padding: '20px 40px 30px 40px !important',
            fontWeight: '500'
          }}>
            Do you really want to change the status of this record? This process can be reversed.
          </Typography>
          <InactiveButton variant="contained" onClick={handleInactive}>
            Inactive
          </InactiveButton>
          <ActiveButton variant="contained" onClick={handleActive}>
            Active
          </ActiveButton>
        </DialogContent>
      </Dialog>
    </div>
  );
}