import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';

import {
  Button,
  Dialog,
  DialogContent,
  Typography
} from '@mui/material';

const CancelButton = styled(Button)(({ theme }) => ({
    background: '#888888',
    margin: '0 10px !important',
    boxShadow: 'none',
    '&:hover':{
      background: '#777777 !important',
      boxShadow: '0px 0px 6px 0px #777777'
    }
}));

const DeleteButton = styled(Button)(({ theme }) => ({
    background: '#f71818',
    margin: '0 10px !important',
    boxShadow: 'none',
    '&:hover':{
      background: '#e21515 !important',
      boxShadow: '0px 0px 6px 0px #e21515'
    }
}));


export default function ConfirmDeleteAddress(props) {
  const {openDialog, setOpenDialog} = props;
  const [status, setStatus] = React.useState(false);

  const handleClose = () => {
    setOpenDialog((prevState) => ({
      ...prevState,
      status: false
    }));
  };

  const handleDelete = () => {
    setStatus(true);
    setOpenDialog((prevState) => ({
      ...prevState,
      status: false
    }));
  }

  useEffect(() => {
    props.confirmDialog(status, openDialog.id)
    setStatus(false)
  }, [status])

  return (
    <div>      
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog.status}>
        <DialogContent sx={{
          padding: '60px !important',
          textAlign: 'center'
        }}>
          <Typography variant="h3">
            Are you sure ?
          </Typography>
          <Typography variant="h6" sx={{
            padding: '20px 40px 30px 40px !important',
            fontWeight: '500'
          }}>
            Do you really want to delete this record? This process cannot be reversed.
          </Typography>
          <CancelButton variant="contained" onClick={handleClose}>
            No, Cancel!
          </CancelButton>
          <DeleteButton variant="contained" onClick={handleDelete}>
            Yes Delete it!
          </DeleteButton>
        </DialogContent>
      </Dialog>
    </div>
  );
}