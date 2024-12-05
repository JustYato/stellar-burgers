import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import {
  TNewOrderResponse,
  TOrderResponse,
  getOrderByNumberApi,
  orderBurgerApi
} from '../utils/burger-api';
import { resetBurgerConstructor } from './burgerConstructorSlice';

export type OrderState = {
  orderData: TOrder | null;
  requestStatus: RequestStatus;
};

export const initialState: OrderState = {
  orderData: null,
  requestStatus: RequestStatus.Idle
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (idArray: string[], { dispatch }) => {
    const response = await orderBurgerApi(idArray);
    dispatch(resetBurgerConstructor());
    return response;
  }
);

export const getOrder = createAsyncThunk('order/getId', getOrderByNumberApi);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderInfo(state) {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(createOrder.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.requestStatus = RequestStatus.Success;
          state.orderData = action.payload.order;
        }
      )
      .addCase(getOrder.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(getOrder.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getOrder.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.requestStatus = RequestStatus.Success;
          state.orderData = action.payload.orders[0];
        }
      );
  }
});

const selectOrderState = (state: { order: OrderState }) => state.order;

export const selectOrderStatus = createSelector(
  selectOrderState,
  (orderState) => orderState.requestStatus
);
export const selectOrderInfo = createSelector(
  selectOrderState,
  (orderState) => orderState.orderData
);
export const { resetOrderInfo } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
