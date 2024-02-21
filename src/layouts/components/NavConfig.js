// component
import Iconify from '../../components/Iconify';
import Triangle from '../../assets/images/triangle.png'
import Man from '../../assets/images/man.png'

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const getImage = (name) => <img src={name} width={20} height={20} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/user',
    icon: getIcon('eva:people-fill'),
  },
  // {
  //   title: 'role',
  //   path: '/role',
  //   icon: getIcon('eva:lock-fill'),
  // },
  {
    title: 'Reported Crimes',
    path: '/reports',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'Corporates/Groups',
    path: '/Corporate',
    icon: getImage(Triangle),
  },
  {
    title: 'Public Accesibility',
    path: '/public-accessiblity',
    icon: getImage(Man),
  },
];

export default navConfig;
