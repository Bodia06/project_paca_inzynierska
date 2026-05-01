import { Navigate, Outlet } from 'react-router-dom';
import CONSTANTS from '../../constants';

const PublicRoute = ({ user }) => {
  if (user) {
    return <Navigate to={CONSTANTS.APP_ROUTERS.HOME} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
