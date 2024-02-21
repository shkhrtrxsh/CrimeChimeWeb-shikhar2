import Iconify from 'src/components/Iconify';
import { Link } from "react-router-dom";
import { alpha, styled } from '@mui/material/styles';
import { 
    Typography,
    Breadcrumbs,
    Stack,
    ListItemIcon,
    ListItemText 
} from '@mui/material'
const BreadcrumbNavigator = ({navigate, currentPage, rightButton,centerButton}) => {

    const RightLinkButton = styled(Link)(({ theme }) => ({
        display: 'inherit',
        background: theme.palette.primary.main,
        padding : '.4rem .8rem',
        textDecoration : 'none',
        color: theme.palette.common.white,
        borderRadius: Number(theme.shape.borderRadius),
        textTransform: 'capitalize',
        // width: '100%'
    }));

    const LinkButton = styled(Link)(({ theme }) => ({
        textDecoration : 'none',
        color: alpha(theme.palette.primary.main, .7),
        textTransform: 'capitalize',
    }));

                // sx={{
            //     background : '#ffffff',
            //     padding : '20px',
            //     boxShadow: '0px 0px 6px 0px #ddd',
            //     borderRadius : '8px'
            // }} 

    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            mb={5}
            sx={{
                margin: rightButton?'15px 15px 30px 15px':'0 15px 30px 15px',
                width:rightButton?"100%":"90%"
            }}

        >
            <Breadcrumbs
                separator={<Iconify icon="ic:round-navigate-next" />}
                aria-label="breadcrumb"
            >
                { navigate && navigate.map((nav, index) => (
                    <LinkButton
                        to={nav.link}
                        key={index}
                    >
                        {nav.name}
                    </LinkButton>
                ))}
                <Typography component="h2" variant="h4">
                    { currentPage }
                </Typography>            
            </Breadcrumbs>
            { rightButton ?
                <RightLinkButton
                    to={rightButton.link}
                >
                    <ListItemIcon sx={{minWidth: 'auto'}}>
                        <Iconify icon="carbon:add" sx={{fontSize : 30, color:'#fff'}} />
                    </ListItemIcon>
                    <ListItemText primary={rightButton.name} primaryTypographyProps={{ variant: 'body2' }} />
                </RightLinkButton>
                : ''
            }
            { centerButton ?
                <RightLinkButton
                    to={centerButton.link}
                >
                    <ListItemIcon sx={{minWidth: 'auto'}}>
                        <Iconify icon="carbon:add" sx={{fontSize : 30, color:'#fff'}} />
                    </ListItemIcon>
                    <ListItemText primary={centerButton.name} primaryTypographyProps={{ variant: 'body2' }} />
                </RightLinkButton>
                : ''
            }
        </Stack>
    )
}

export default BreadcrumbNavigator