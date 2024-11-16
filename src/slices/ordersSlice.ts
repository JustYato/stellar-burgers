import { RequestStatus, TOrder } from '@utils-types';
import { getOrdersApi } from '../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface OrdersState {
  orders: TOrder[];
  requestStatus: RequestStatus;
}

export const initialState: OrdersState = {
  orders: [],
  requestStatus: RequestStatus.Idle
};

export const getOrders = createAsyncThunk('orders/getMy', getOrdersApi);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(getOrders.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.requestStatus = RequestStatus.Success;
          state.orders = action.payload;
        }
      );
  },
  selectors: {
    selectOrders: (state: OrdersState) => state.orders
  }
});

export const { selectOrders } = ordersSlice.selectors;
export const { reducer: ordersReducer } = ordersSlice;
