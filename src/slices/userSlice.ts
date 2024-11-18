import { RequestStatus, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';

export interface TUserState {
  isAuthVerified: boolean;
  user: TUser | null;
  requestStatus: RequestStatus;
}

export const initialState: TUserState = {
  isAuthVerified: false,
  user: null,
  requestStatus: RequestStatus.Idle
};

const setAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearAuthTokens = () => {
  deleteCookie('accessToken');
  localStorage.clear();
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response?.success) {
      setAuthTokens(response.accessToken, response.refreshToken);
      return response.user;
    }
    throw new Error('Login failed');
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response?.success) {
      setAuthTokens(response.accessToken, response.refreshToken);
      return response.user;
    }
    throw new Error('Registration failed');
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    if (!document.cookie.includes('accessToken')) {
      return rejectWithValue('User is not authorized');
    }
    const response = await getUserApi();
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  clearAuthTokens();
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: TRegisterData) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const handlePending = (state: TUserState) => {
  state.requestStatus = RequestStatus.Loading;
  state.isAuthVerified = false;
};

const handleRejected = (state: TUserState) => {
  state.requestStatus = RequestStatus.Failed;
  state.isAuthVerified = true;
};

const handleFulfilled = (state: TUserState, user: TUser | null) => {
  state.user = user;
  state.requestStatus = RequestStatus.Success;
  state.isAuthVerified = true;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(registerUser.fulfilled, (state, { payload }) =>
        handleFulfilled(state, payload)
      )
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(loginUser.fulfilled, (state, { payload }) =>
        handleFulfilled(state, payload)
      )
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.rejected, handleRejected)
      .addCase(updateUser.fulfilled, (state, { payload }) =>
        handleFulfilled(state, payload)
      )
      .addCase(checkUserAuth.pending, handlePending)
      .addCase(checkUserAuth.rejected, handleRejected)
      .addCase(checkUserAuth.fulfilled, (state, { payload }) =>
        handleFulfilled(state, payload)
      )
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.rejected, handleRejected)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.requestStatus = RequestStatus.Success;
        state.isAuthVerified = true;
      });
  },
  selectors: {
    isAuthVerifiedSelector: (state: TUserState) => state.isAuthVerified,
    selectUser: (state: TUserState) => state.user,
    selectUserName: (state: TUserState) => state.user?.name
  }
});

export const { isAuthVerifiedSelector, selectUser, selectUserName } =
  userSlice.selectors;
export const { reducer: userReducer } = userSlice;
