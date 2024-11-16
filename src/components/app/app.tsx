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
import stylesOrder from '../ui/order-info/order-info.module.css';
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

const App: React.FC = () => {
  const navigate = useNavigate();
  const closeModal = () => navigate(-1);
  const location = useLocation();
  const isBackground = location.state?.background;
  const dispatch = useDispatch();
  const orderFromProfile = useMatch('/profile/orders/:number')?.params.number;
  const orderFromFeed = useMatch('/feed/:number')?.params.number;
  const orderNumber = orderFromFeed || orderFromProfile;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <AppHeader />
      <Routes location={isBackground || location}>
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

      {isBackground && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <div className={`${stylesOrder.wrapper} pt-10`}>
                <h3 className='text text_type_main-large'>
                  {`#${orderNumber?.padStart(6, '0')}`}
                </h3>
                <OrderInfo />
              </div>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${orderNumber?.padStart(6, '0')}`}
                onClose={closeModal}
              >
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
                  onClose={closeModal}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
