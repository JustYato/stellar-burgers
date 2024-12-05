import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../../slices/ingredientsSlice';
import { burgerConstructorSlice } from '../../slices/burgerConstructorSlice';
import { orderSlice } from '../../slices/orderSlice';
import { userSlice } from '../../slices/userSlice';
import { feedSlice } from '../../slices/feedSlice';
import { ordersSlice } from '../../slices/ordersSlice';
import store from '../store';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    [ingredientsSlice.name]: ingredientsSlice.reducer,
    [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
    [orderSlice.name]: orderSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [feedSlice.name]: feedSlice.reducer,
    [ordersSlice.name]: ordersSlice.reducer
  });

  const initialState = {
    [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
    [burgerConstructorSlice.name]: burgerConstructorSlice.getInitialState(),
    [orderSlice.name]: orderSlice.getInitialState(),
    [userSlice.name]: userSlice.getInitialState(),
    [feedSlice.name]: feedSlice.getInitialState(),
    [ordersSlice.name]: ordersSlice.getInitialState()
  };

  const createTestStore = () =>
    configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

  const assertSlices = (state: any) => {
    const slices = [
      ingredientsSlice,
      burgerConstructorSlice,
      orderSlice,
      userSlice,
      feedSlice,
      ordersSlice
    ];

    slices.forEach((slice) => {
      expect(state).toHaveProperty(slice.name);
      expect(state[slice.name]).toEqual(slice.getInitialState());
    });
  };

  it('Инициализация хранилища', () => {
    const testStore = createTestStore();
    const state = testStore.getState();

    assertSlices(state);
  });

  it('Использование rootReducer', () => {
    const state = store.getState();

    assertSlices(state);
  });

  it('Возвращение начального состояние', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(initialState);
  });
});
