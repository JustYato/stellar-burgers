import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch
} from 'react-router-dom';
import { getIngredients } from '../../slices/ingredientsSlice';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { useEffect } from 'react';
import { ProtectedRoute } from '../../protectedRoute/ProtectedRoute';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../slices/userSlice';

const useOrderNumber = () => {
  const orderFromProfile = useMatch('/profile/orders/:number')?.params.number;
  const orderFromFeed = useMatch('/feed/:number')?.params.number;
  return orderFromFeed || orderFromProfile;
};

const ModalRoutes: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const orderNumber = useOrderNumber();
  return (
    <Routes>
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Детали ингредиента' onClose={onClose}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/feed/:number'
        element={
          <Modal title={`#${orderNumber?.padStart(6, '0')}`} onClose={onClose}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <Modal
              title={`#${orderNumber?.padStart(6, '0')}`}
              onClose={onClose}
            >
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const MainRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<ConstructorPage />} />
    <Route path='/feed' element={<Feed />} />
    <Route
      path='/login'
      element={
        <ProtectedRoute onlyUnAuth>
          <Login />
        </ProtectedRoute>
      }
    />
    <Route
      path='/register'
      element={
        <ProtectedRoute onlyUnAuth>
          <Register />
        </ProtectedRoute>
      }
    />
    <Route
      path='/forgot-password'
      element={
        <ProtectedRoute onlyUnAuth>
          <ForgotPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path='/reset-password'
      element={
        <ProtectedRoute onlyUnAuth>
          <ResetPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path='/profile'
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path='/profile/orders'
      element={
        <ProtectedRoute>
          <ProfileOrders />
        </ProtectedRoute>
      }
    />
    <Route path='/ingredients/:id' element={<IngredientDetails />} />
    <Route path='*' element={<NotFound404 />} />
  </Routes>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isBackground = location.state?.background;
  const closeModal = () => navigate(-1);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <AppHeader />
      <MainRoutes />
      {isBackground && <ModalRoutes onClose={closeModal} />}
    </div>
  );
};

export default App;
