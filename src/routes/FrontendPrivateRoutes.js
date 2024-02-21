import AddReport from "src/pages/Frontend/AddReport";
import Profile from "src/pages/Frontend/User/Profile";
import EditProfile from "src/pages/Frontend/User/EditProfile";
import EditAddress from "src/pages/Frontend/User/EditAddress";
import MyReport from "src/pages/Frontend/User/MyReport";
import ReportWrapper from "src/layouts/Report/ReportWrapper";
import Addresses from "src/pages/Frontend/User/my-addresses"
import EditSingleAddress from "src/pages/Frontend/User/my-addresses/edit"
import AddAddress from "src/pages/Frontend/User/my-addresses/add"
const FrontendPrivateRoutes = [
    {
        path: '/report/add',
        element: <ReportWrapper/>
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/profile/edit',
        element: <EditProfile />
    },
    {
        path: '/profile/address-edit',
        element: <EditAddress />
    },
    {
        path: '/my-report',
        element: <MyReport />
    },
    {
        path: '/my-addresses',
        element: <Addresses />
    },
    {
        path: '/my-addresses/add',
        element: <AddAddress/>
    },
    {
        path: '/my-addresses/edit/:id',
        element: <EditSingleAddress/>
    },
    {
        path: '/profile/address-edit',
        element: <EditAddress />
    },
]


export default FrontendPrivateRoutes;