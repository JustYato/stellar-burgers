import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
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
        (state, action: PayloadAction<TFeedsResponse>) => {
          const payload = action.payload;
          state.requestStatus = RequestStatus.Success;
          state.orders = payload.orders;
          state.total = payload.total;
          state.totalToday = payload.totalToday;
        }
      );
  }
});

const selectFeedState = (state: { feed: FeedState }) => state.feed;

export const selectOrders = createSelector(
  selectFeedState,
  (state) => state.orders
);
export const selectTotal = createSelector(
  selectFeedState,
  (state) => state.total
);
export const selectTotalToday = createSelector(
  selectFeedState,
  (state) => state.totalToday
);
export const selectFeedStatus = createSelector(
  selectFeedState,
  (state) => state.requestStatus
);
export const feedReducer = feedSlice.reducer;
