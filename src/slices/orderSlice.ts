import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import {
  TNewOrderResponse,
  TOrderResponse,
  getOrderByNumberApi,
  orderBurgerApi
} from '../utils/burger-api';
import { resetBurgerConstructor } from './burgerConstructorSlice';

type OrderState = {
  order: TOrder | null;
  requestStatus: RequestStatus;
};

const initialState: OrderState = {
  order: null,
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

export const getOrder = createAsyncThunk('order/getId', (idOrder: number) =>
  getOrderByNumberApi(idOrder)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderInfo(state) {
      state.order = null;
    }
  },
  extraReducers(builder) {
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
          state.order = action.payload.order;
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
          state.order = action.payload.orders[0];
        }
      );
  },
  selectors: {
    selectOrderStatus(state: OrderState) {
      return state.requestStatus;
    },
    selectOrderInfo(state: OrderState) {
      return state.order;
    }
  }
});

export const { selectOrderStatus, selectOrderInfo } = orderSlice.selectors;
export const { resetOrderInfo } = orderSlice.actions;
export const { reducer: orderReducer } = orderSlice;