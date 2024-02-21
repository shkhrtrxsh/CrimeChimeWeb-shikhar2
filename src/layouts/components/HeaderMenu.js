import { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import { styled, useTheme, theme } from '@mui/material/styles';
import { Box, Drawer, Button, IconButton, Divider } from '@mui/material';
import Iconify from 'src/components/Iconify';
import useResponsive from '../../hooks/useResponsive';
import { IsAuth, User, IsAdmin } from 'src/helpers/RouteHelper';
import palette from 'src/theme/palette';
import { logout } from 'src/store/api/auth';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Bell from 'src/assets/images/bell.png'
import NotificationsModal from './NotificationsModal';
import API from 'src/config/api';
import { toast } from 'react-toastify';
import PushNotification from 'src/components/pushNotification';

const LinkButton = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    display: 'inline-block',
    color: theme.palette.secondary.main,
    marginLeft: '3px',
    marginRight: '3px',
    padding: '5px',
    "&:hover": {
        color: theme.palette.secondary.main,
    },
    "&.active": {
        color: theme.palette.secondary.main,
    }
}));


const LinkDrawerButton = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    width: '100%',
    display: 'block',
    padding: '8px 10px',
    "&:hover": {
        color: theme.palette.primary.main,
    },
    "&.active": {
        color: theme.palette.secondary.main,
    }
}));

const btnStyle = {
    background: palette.secondary.main,
    color: palette.primary.main,
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '.3rem'
}


export default function HeaderMenu(props) {

    const [drawerState, setDrawerState] = useState(false);
    const isDesktop = useResponsive('up', 'md');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme()
    const isAuth = IsAuth();
    const user = User()
    const isAdmin = IsAdmin()

    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    const logoutSession = () => {
        dispatch(logout({ navigate }))
    }
    const [notificationModal,setNotificationModal] = useState(false)
    const notificationModalHandler = () => {
        setNotificationModal(p=>!p)
    }
    const [count,setCount] = useState(null)
    const getCount = async () => {
        const response = await API.get('/countNotification')
        if(response.data.code == 200){
            setCount(response.data.data)
        }else{
            toast.error(response.data.message,{
                toastId:'skjjs999'
            })
        }
    }
    useEffect(()=>{
        if(isAuth == 1){
            getCount();
        }
    },[])
    return (
        isDesktop ?
            <>
                <LinkButton
                    to="/"
                    activeclassname=""
                >
                    Home
                </LinkButton>
                {isAuth == 0 ?
                    <>
                        {/* <LinkButton
                            to="/register"
                            activeclassname="active"
                        >
                            Register
                        </LinkButton> */}
                        <LinkButton
                            to="/login"
                            activeclassname="active"
                            style={btnStyle}
                        >
                            Login
                        </LinkButton>
                    </>
                    :
                    <>
                        {isAdmin === 1 ?
                            <LinkButton
                                to="/dashboard"
                                activeclassname=""
                            >
                                Admin Dashboard
                            </LinkButton>
                            : ''
                        }
                        <LinkButton
                            to="/my-addresses"
                            activeclassname=""
                        >
                            Crime Tracker
                        </LinkButton>
                        <LinkButton
                            to="/profile"
                            activeclassname=""
                        >
                            Profile
                        </LinkButton>
                        <div style={{position:"relative"}}>
                            {count != null && <h6 style={{display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",right:"-4px",top:"-4px",background:"yellow",color:"black",height:"12px",width:"12px",borderRadius:"12px"}}>{count}</h6>}
                            {count != null && <PushNotification/>}
                            <img src={Bell} style={{height:"24px",width:"24px",cursor:"pointer"}} onClick={notificationModalHandler} />
                            {notificationModal && <NotificationsModal handler={notificationModalHandler} />}
                        </div>
                        <Button
                            onClick={logoutSession}
                            activeclassname="active"
                            style={btnStyle}
                        >
                            Logout
                        </Button>
                    </>
                }
            </>
            :
            <>
    <IconButton onClick={handleDrawerOpen} sx={{ mr: 1, color: "#fff" }}>
        <Iconify icon="eva:menu-2-fill" />
    </IconButton>
    <Drawer
        open={drawerState}
        onClose={handleDrawerClose}
    >
        <Box
            sx={{
                width: 250,
                marginTop: '30px',
                backgroundColor: 'white', // Set your desired background color
                height: '100%', // Make the drawer full height
                display: 'flex',
                flexDirection: 'column', // Align items vertically
                marginLeft: '32px', // Add padding
                color: '#fff', // Text color
            }}
            role="presentation"
        >
            <LinkDrawerButton
                
                to="/"
                onClick={handleDrawerClose}
                activeclassname=""
                
            >
                Home
            </LinkDrawerButton>
            {isAuth === 0 ?
                <>
                    <LinkDrawerButton
                        to="/login"
                        activeclassname="active"
                        style={btnStyle}
                    >
                        Login
                    </LinkDrawerButton>
                </>
                :
                <>
                    {isAdmin === 1 &&
                        <LinkDrawerButton
                            to="/dashboard"
                            activeclassname="active"
                        >
                            Admin Dashboard
                        </LinkDrawerButton>
                    }
                    {isAdmin === 1 && 
                        <LinkDrawerButton
                        to="/my-addresses"
                        activeclassname="active"
                    >
                        Crime Tracker
                    </LinkDrawerButton>
                    }
                    {isAdmin === 1 && 
                        <LinkDrawerButton
                        to="/profile"
                        activeclassname="active"
                    >
                        Profile
                    </LinkDrawerButton>
                    }
                    
                    
                    {isAuth==0?<LinkDrawerButton
                        to="/login"
                        activeclassname="active"
                        style={btnStyle}
                    >
                        Login
                    </LinkDrawerButton>:<Button
                    onClick={logoutSession}
                    activeclassname="active"
                    variant="text"
                    sx={{
                        color: theme.palette.primary.main,
                        background: 'black',
                        marginTop: '12px',
                        fontSize: '16px',
                        color: 'white'
                    }}
                >
                    Logout
                </Button>}
                    
                </>
            }
        </Box>
    </Drawer>
</>


    );
}