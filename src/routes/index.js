import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import AppLayoutWithSidebar from '../layouts/AppLayoutWithSidebar';
import AppLayout from '../layouts/AppLayout';
import { IsAuth, IsAdmin } from 'src/helpers/RouteHelper';

// Routes Layouts
import BackendPrivateRoutes from './BackendPrivateRoutes';
import FrontendRoutes from './FrontendRoutes';
import FrontendPrivateRoutes from './FrontendPrivateRoutes';

// Routes
import NotFound from '../pages/Error/Page404';


// ----------------------------------------------------------------------

export default function Router() {

  const isAuth = IsAuth()
  const isAdmin = IsAdmin()

  const RouteIndexing = [

    {
      path: '/',
      element: <AppLayout />,
      children: FrontendRoutes
    },
    {
      path: '/',
      element: isAuth === true ? <AppLayout />  : <Navigate to="/login" />,
      children: FrontendPrivateRoutes
    },
    {
      path: '/',
      element: isAuth === true && isAdmin === 1 ? <AppLayoutWithSidebar />  : <Navigate to="/" />,
      children: BackendPrivateRoutes
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    { 
      path: '404', element: 
      <NotFound /> 
    },
  ]


  return useRoutes(RouteIndexing);
}
