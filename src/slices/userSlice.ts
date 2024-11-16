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

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const response = await loginUserApi({ email, password });
    if (response?.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    const response = await registerUserApi({ email, name, password });
    if (response?.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, thunkAPI) => {
    if (!document.cookie.includes('accessToken')) {
      return thunkAPI.rejectWithValue('User is not authorized');
    }
    const response = await getUserApi();
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ email, name, password }: TRegisterData) => {
    const response = await updateUserApi({ email, name, password });
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isAuthVerified = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthVerified = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.requestStatus = RequestStatus.Success;
        state.isAuthVerified = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isAuthVerified = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthVerified = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.requestStatus = RequestStatus.Success;
        state.isAuthVerified = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isAuthVerified = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthVerified = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.requestStatus = RequestStatus.Success;
        state.isAuthVerified = true;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isAuthVerified = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthVerified = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.requestStatus = RequestStatus.Success;
        state.isAuthVerified = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.isAuthVerified = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.isAuthVerified = true;
      })
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
