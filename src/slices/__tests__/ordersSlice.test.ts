import { RequestStatus, TOrder } from '@utils-types';
import {
  ordersSlice,
  getOrders,
  OrdersState,
  initialState
} from '../ordersSlice';

describe('ordersSlice', () => {
  const testOrdersResponse: TOrder[] = [
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

  const createState = (action: any, state = initialState) =>
    ordersSlice.reducer(state, action);

  describe('Тест редьюсера ordersSlice', () => {
    const expectedSuccessState: OrdersState = {
      requestStatus: RequestStatus.Success,
      ordersData: testOrdersResponse
    };

    it('Устанавка loading getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Обновление состояние на success при getOrders.fulfilled', () => {
      const action = getOrders.fulfilled(testOrdersResponse, '');
      const state = createState(action);

      expect(state).toEqual(expectedSuccessState);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Обновление состояние на failed при getOrders.rejected', () => {
      const expectedFailedState: OrdersState = {
        ...initialState,
        requestStatus: RequestStatus.Failed
      };
      const action = getOrders.rejected(new Error('Error'), '');
      const state = createState(action);

      expect(state).toEqual(expectedFailedState);
      expect(state.requestStatus).toBe(RequestStatus.Failed);
    });
  });
});
