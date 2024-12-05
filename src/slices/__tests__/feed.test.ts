import { TFeedsResponse } from '../../utils/burger-api';
import { RequestStatus, TOrder } from '@utils-types';
import { feedSlice, getFeed, initialState } from '../feedSlice';

describe('feedSlice', () => {
  const feedTestResponseOrders: TOrder[] = [
    {
      _id: '6750450ee367de001daf6ab9',
      ingredients: [
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0944',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Традиционный-галактический флюоресцентный био-марсианский бургер',
      createdAt: '2024-12-04T12:03:26.016Z',
      updatedAt: '2024-12-04T12:03:26.906Z',
      number: 61532
    }
  ];

  const feedTestResponse: TFeedsResponse = {
    orders: feedTestResponseOrders,
    total: 100,
    totalToday: 10,
    success: true
  };

  const createState = (action: any, state = initialState) =>
    feedSlice.reducer(state, action);

  const expectedStates = {
    loading: { ...initialState, requestStatus: RequestStatus.Loading },
    success: {
      orders: feedTestResponseOrders,
      total: 100,
      totalToday: 10,
      requestStatus: RequestStatus.Success
    },
    failed: { ...initialState, requestStatus: RequestStatus.Failed }
  };

  describe('Тесты редьюсера feedSlice', () => {
    it('Состояние loading при getFeed.pending', () => {
      const action = { type: getFeed.pending.type };
      const state = createState(action);

      expect(state).toEqual(expectedStates.loading);
    });

    it('Обновление состояние на success при getFeed.fulfilled', () => {
      const action = getFeed.fulfilled(feedTestResponse, '');
      const state = createState(action);

      expect(state).toEqual(expectedStates.success);
    });

    it('Обновление состояние на failed при getFeed.rejected', () => {
      const action = getFeed.rejected(new Error('Error'), '');
      const state = createState(action);

      expect(state).toEqual(expectedStates.failed);
    });
  });
});
