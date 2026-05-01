import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../Helpers/Spinner/Spinner';

const PrivateRoute = ({ isFetching, user }) => {
  if (isFetching) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
