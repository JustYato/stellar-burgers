import { RequestStatus, TUser } from '@utils-types';
import { TLoginData, TRegisterData } from '@api';
import {
  TUserState,
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  updateUser,
  userSlice,
  initialState
} from '../userSlice';

describe('userSlice', () => {
  const testUserResponse: TUser = {
    email: 'default2312@yandex.ru',
    name: 'MrBeast'
  };

  const testUserRegister: TRegisterData = {
    name: 'MrBeast',
    email: 'default2312@yandex.ru',
    password: '123456'
  };

  const testUserRequest: TLoginData = {
    email: 'default2312@yandex.ru',
    password: '123456'
  };

  const createState = (action: any, state = initialState) =>
    userSlice.reducer(state, action);

  const expectedState = (
    status: RequestStatus,
    userData: TUser | null = null,
    isAuthVerified = true
  ): TUserState => ({
    userData,
    isAuthVerified,
    requestStatus: status
  });

  describe('Тест редьюсера userSlice', () => {
    it('Устанавка loading при loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
      expect(state.isAuthVerified).toBe(false);
    });

    it('Обновление состояние на success при loginUser.fulfilled', () => {
      const action = loginUser.fulfilled(testUserResponse, '', testUserRequest);
      const state = createState(action);

      expect(state).toEqual(
        expectedState(RequestStatus.Success, testUserResponse)
      );
    });

    it('Обновление состояние на failed при loginUser.rejected', () => {
      const action = loginUser.rejected(
        new Error('Error'),
        '',
        testUserRequest
      );
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Failed));
    });

    it('Устанавка loading при registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Обновление состояние на success при registerUser.fulfilled', () => {
      const action = registerUser.fulfilled(
        testUserResponse,
        '',
        testUserRegister
      );
      const state = createState(action);

      expect(state).toEqual(
        expectedState(RequestStatus.Success, testUserResponse)
      );
    });

    it('Обновление состояние на failed при registerUser.rejected', () => {
      const action = registerUser.rejected(
        new Error('Error'),
        '',
        testUserRegister
      );
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Failed));
    });

    it('Устанавка loading при updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Обновление состояние на success при updateUser.fulfilled', () => {
      const action = updateUser.fulfilled(
        testUserResponse,
        '',
        testUserRegister
      );
      const state = createState(action);

      expect(state).toEqual(
        expectedState(RequestStatus.Success, testUserResponse)
      );
    });

    it('Обновление состояние на failed при updateUser.rejected', () => {
      const action = updateUser.rejected(
        new Error('Error'),
        '',
        testUserRegister
      );
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Failed));
    });

    it('Устанавка loading при checkUserAuth.pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Обновление состояние на success при checkUserAuth.fulfilled', () => {
      const action = checkUserAuth.fulfilled(testUserResponse, '');
      const state = createState(action);

      expect(state).toEqual(
        expectedState(RequestStatus.Success, testUserResponse)
      );
    });

    it('Обновление состояние на failed при checkUserAuth.rejected', () => {
      const action = checkUserAuth.rejected(new Error('Error'), '');
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Failed));
    });

    it('Устанавка loading при logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Обновление состояние на success при logoutUser.fulfilled', () => {
      const action = logoutUser.fulfilled(undefined, '');
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Success, null));
    });

    it('Обновление состояние на failed при logoutUser.rejected', () => {
      const action = logoutUser.rejected(new Error('Error'), '');
      const state = createState(action);

      expect(state).toEqual(expectedState(RequestStatus.Failed));
    });
  });
});
