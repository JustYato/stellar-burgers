import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
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

export const getFeeds = createAsyncThunk('feeds/getAll', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeeds.pending, (state) => {
        Object.assign(state, { requestStatus: RequestStatus.Loading });
      })
      .addCase(getFeeds.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          const payload = action.payload;
          state.requestStatus = RequestStatus.Success;
          state.orders = payload.orders;
          state.total = payload.total;
          state.totalToday = payload.totalToday;
        }
      );
  },
  selectors: {
    selectOrders(state: FeedState) {
      return state.orders;
    },
    selectFeed(state: FeedState) {
      return state;
    },
    getStatusRequest(state: FeedState) {
      return state.requestStatus;
    }
  }
});

export const { selectOrders, selectFeed, getStatusRequest } =
  feedSlice.selectors;
export const { reducer: feedReducer } = feedSlice;
