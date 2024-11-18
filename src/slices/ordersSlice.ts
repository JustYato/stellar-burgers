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

export const getOrders = createAsyncThunk('orders/getMy', async () => {
  const orders = await getOrdersApi();
  if (!Array.isArray(orders)) {
    throw new Error('Failed to fetch orders');
  }
  return orders;
});

const handlePending = (state: OrdersState) => {
  state.requestStatus = RequestStatus.Loading;
};

const handleRejected = (state: OrdersState) => {
  state.requestStatus = RequestStatus.Failed;
};

const handleFulfilled = (
  state: OrdersState,
  action: PayloadAction<TOrder[]>
) => {
  state.requestStatus = RequestStatus.Success;
  state.orders = action.payload;
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, handlePending)
      .addCase(getOrders.rejected, handleRejected)
      .addCase(getOrders.fulfilled, handleFulfilled);
  }
});

export const selectOrders = (state: { orders: OrdersState }) =>
  state.orders.orders;
export const { reducer: ordersReducer } = ordersSlice;
