import  { useEffect,useState } from 'react';
import * as React from 'react';

import {
  Container,
  Typography,
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import API from 'src/config/api';
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from 'src/store/api/user';
import { useNavigate } from 'react-router-dom';
import Page from '../../../components/Page';
import { allowAddReport } from 'src/store/api/report';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [checked,setChecked] = useState(true)
  const [checked2,setChecked2] = useState(false)
  const [checked3,setChecked3] = useState(false)

  const { user } = useSelector((state) => ({ ...state.user }));
  const reportPermissionHandler = async () => {
    const response = await API.get(`/reportPermission`);
    setToggle(response.data.data == 1 ? true : false)
  }
  const reportDisplayPermissionHandler = async () => {
    const response = await API.get(`/getDisplayPermission`);
    setChecked(response.data.data)
  }
  useEffect(() => {
    dispatch(dashboard({}));
    reportPermissionHandler();
    reportDisplayPermissionHandler();
  }, []);
  const handleChange = async () => {
    const val = toggle;
    setToggle(p=>!p);
    const formValue = {
      allow_add: !val?1:0
    }
    const response = await API.post(`/allowAddReport`,formValue);
  };
  const handleCardClick = (path) => {
    navigate(path);
  };
  const checkboxHnadler = async (e) => {
    setChecked(e.target.value)
    const formValue = {
      permission: e.target.value
    }
    const response = await API.post(`/setDisplayPermission`,formValue);
    if(response){
      toast.success(response.data.message)
    }
  }
  
  return (
    <Page title="Public Accesibility">
      <Container maxWidth="xl">
        <Typography variant='h4'>Public Accesibility</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 5, pl: 2 ,border:"1px solid black",p:5 }}>
          <ToggleButtonGroup
            color="success"
            value={toggle}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value={true}>On</ToggleButton>
            <ToggleButton value={false}>Off</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
            Public User Ability to Report Crimes
          </Typography>
        </Box>
        
        <Box sx={{ my: 5, pl: 2 ,border:"1px solid black",py:5 }}>
        <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'left' }}>
        Display Public User Crime Reports
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
          <Checkbox checked={checked == 1 ? true:false} name="Reports" value={1} onChange={checkboxHnadler} />
          <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
            Show All Public  User Reports
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
          <Checkbox checked={checked == 2 ? true:false} name="Reports" value={2} onChange={checkboxHnadler} />
          <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
            Only Show Approved Public Reports
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', my: 2, pl: 2 }}>
          <Checkbox checked={checked == 3 ? true:false} name="Reports" value={3} onChange={checkboxHnadler} />
          <Typography variant="h6" sx={{ fontWeight: 'normal', px: 2, textAlign: 'center' }}>
            Do Not Show Any Public Reports
          </Typography>
        </Box>
        </Box>
      </Container>
    </Page>
  );
}
