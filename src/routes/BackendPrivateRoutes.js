import Dashboard from '../pages/Backend/Dashboard';
//User
import AddUser from '../pages/Backend/User/AddUser'
import User from '../pages/Backend/User/User'
import EditUser from '../pages/Backend/User/EditUser'
import ShowUser from '../pages/Backend/User/ShowUser'
//Role
import AddRole from '../pages/Backend/Role/AddRole'
import Role from '../pages/Backend/Role/Role'
import EditRole from 'src/pages/Backend/Role/EditRole';
//Report
import Report from '../pages/Backend/Report/Report'
import Addnote from '../pages/Backend/Report/Addnote';
//corporate
import AddCorporate from '../pages/Backend/Corporate/AddCorporate'
import Corporate from '../pages/Backend/Corporate/ListCorporate.jsx'
import EditCorporate from '../pages/Backend/Corporate/[id].js'
import ShowCorporate from '../pages/Backend/Corporate/ShowCorporate'
import PublicAccesibility from '../pages/Backend/public-accessiblity'

const BackendPrivateRoutes = [
    {
        path: 'user/add',
        element: <AddUser />,
    },
    {
        path: 'user',
        element: <User />,
    },
    {
        path: 'user/:id',
        element: <ShowUser />,
    },
    {
        path: 'user/:id/edit', 
        element: <EditUser />
    },
    {
        path: 'dashboard',
        element: <Dashboard />
    },
    {
        path: 'role/add',
        element: <AddRole />,
    },
    {
        path: 'role',
        element: <Role />,
    },
    {
        path: 'role/:id/edit', 
        element: <EditRole />
    },
    {
        path: 'reports', 
        element: <Report />
    },
    {
        path: 'add_note/:id',
        element: <Addnote />
    },
    {
        path: 'user/add',
        element: <AddUser />,
    },
    {
        path: 'Corporate',
        element: <Corporate />,
    },
    {
        path: 'Corporate/add',
        element: <AddCorporate />,
    },
    {
        path: 'Corporate/:id',
        element: <EditCorporate />,
    },
    {
        path: 'user/:id',
        element: <ShowUser />,
    },
    {
        path: 'user/:id/edit', 
        element: <EditUser />
    },
    {
        path: 'public-accessiblity',
        element: <PublicAccesibility />,
    },
]


export default BackendPrivateRoutes;