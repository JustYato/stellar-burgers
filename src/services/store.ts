import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchHook,
  useSelector as useSelectorHook
} from 'react-redux';
import {
  burgerConstructorSlice,
  burgerConstructorReducer
} from '../slices/burgerConstructorSlice';
import { feedSlice, feedReducer } from '../slices/feedSlice';
import {
  ingredientsSlice,
  ingredientsReducer
} from '../slices/ingredientsSlice';
import { orderSlice, orderReducer } from '../slices/orderSlice';
import { ordersSlice, ordersReducer } from '../slices/ordersSlice';
import { userReducer, userSlice } from '../slices/userSlice';

const rootReducers = {
  [burgerConstructorSlice.name]: burgerConstructorReducer,
  [feedSlice.name]: feedReducer,
  [ingredientsSlice.name]: ingredientsReducer,
  [orderSlice.name]: orderReducer,
  [ordersSlice.name]: ordersReducer,
  [userSlice.name]: userReducer
};

const store = configureStore({
  reducer: rootReducers,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = (): AppDispatch => useDispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorHook;

export default store;
