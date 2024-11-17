import { useSelector } from '../services/store';
import { Preloader } from '../components/ui/preloader';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthVerifiedSelector, selectUser } from '../slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const isAuthChecked = useSelector(isAuthVerifiedSelector);
  const user = useSelector(selectUser);
  const location = useLocation();

  const renderPreloader = () => <Preloader />;
  const navigateToLogin = () => (
    <Navigate replace to='/login' state={{ from: location }} />
  );
  const navigateToHome = () => (
    <Navigate replace to={location.state?.from || { pathname: '/' }} />
  );

  if (!isAuthChecked) return renderPreloader();
  if (!onlyUnAuth && !user) return navigateToLogin();
  if (onlyUnAuth && user) return navigateToHome();

  return children;
};

export { ProtectedRoute };
