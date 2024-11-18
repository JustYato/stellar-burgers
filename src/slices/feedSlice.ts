import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus, TOrder, TOrdersData } from '@utils-types';
import { TFeedsResponse, getFeedsApi } from '../utils/burger-api';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  requestStatus: RequestStatus;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  requestStatus: RequestStatus.Idle
};

export const getFeed = createAsyncThunk<TFeedsResponse>(
  'feeds/getAll',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(getFeed.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.requestStatus = RequestStatus.Success;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      );
  },
  selectors: {
    selectOrders: (sliceState: FeedState) => sliceState.orders,
    selectFeed: (sliceState: FeedState) => sliceState,
    getStatusRequest: (sliceState: FeedState) => sliceState.requestStatus,
    selectTotal: (sliceState: FeedState) => sliceState.total,
    selectTotalToday: (sliceState: FeedState) => sliceState.totalToday
  }
});

export const {
  selectOrders,
  selectFeed,
  getStatusRequest,
  selectTotal,
  selectTotalToday
} = feedSlice.selectors;
export const feedReducer = feedSlice.reducer;
