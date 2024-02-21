import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Container } from '@mui/material';
import { APPBAR_MOBILE, APPBAR_DESKTOP, WEB_WIDTH} from 'src/constants/theme'
import { Link } from 'react-router-dom';

import HeaderMenu from './HeaderMenu';
import Logo from 'src/assets/logo/Crime-Chime-Logo.png'

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: theme.palette.common.primary,
  boxShadow: theme.shadows[4],
}));

const ContainerStyle = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    maxWidth: WEB_WIDTH,
    paddingLeft: 0,
    paddingRight: 0,
  },
}));


const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  padding: theme.spacing(0, 0),
  [theme.breakpoints.up('md')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 2),
  },
}));

const LogoImg = styled('img')(({ theme }) => ({
  height: APPBAR_DESKTOP - 25,
  [theme.breakpoints.down('md')]: {
    height: APPBAR_MOBILE - 30,
  },
}));

// ----------------------------------------------------------------------

Navbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function Navbar({ onOpenSidebar }) {
  return (
    <RootStyle>
      <ContainerStyle>
      <ToolbarStyle>
        <Link to="/">
          <LogoImg src={Logo} />
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <HeaderMenu />
        </Stack>
      </ToolbarStyle>
      </ContainerStyle>
    </RootStyle>
  );
}
