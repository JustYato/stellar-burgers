import { RequestStatus, TOrder } from '@utils-types';
import { TNewOrderResponse, TOrderResponse } from '../../utils/burger-api';
import {
  orderSlice,
  createOrder,
  getOrder,
  resetOrderInfo,
  initialState
} from '../orderSlice';

describe('orderSlice', () => {
  const orderTestResponse: TOrderResponse = {
    success: true,
    orders: [
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
    ]
  };

  const newOrderTestResponse: TNewOrderResponse = {
    order: orderTestResponse.orders[0] as TOrder,
    name: '',
    success: true
  };

  const createState = (action: any, state = initialState) =>
    orderSlice.reducer(state, action);

  describe('Тест редьюсера orderSlice', () => {
    const expectedStates = {
      loading: { ...initialState, requestStatus: RequestStatus.Loading },
      failed: { ...initialState, requestStatus: RequestStatus.Failed },
      createOrderSuccess: {
        requestStatus: RequestStatus.Success,
        orderData: orderTestResponse.orders[0]
      },
      getOrderSuccess: {
        requestStatus: RequestStatus.Success,
        orderData: orderTestResponse.orders[0]
      }
    };

    it('Устанавка loading при createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = createState(action);

      expect(state).toEqual(expectedStates.loading);
    });

    it('Обновление состояние на success при createOrder.fulfilled', () => {
      const action = createOrder.fulfilled(newOrderTestResponse, '', []);
      const state = createState(action);

      expect(state).toEqual(expectedStates.createOrderSuccess);
    });

    it('Обновление состояние на failed при createOrder.rejected', () => {
      const action = createOrder.rejected(new Error('Error'), '', []);
      const state = createState(action);

      expect(state).toEqual(expectedStates.failed);
    });

    it('Устанавка loading при getOrder.pending', () => {
      const action = { type: getOrder.pending.type };
      const state = createState(action);

      expect(state).toEqual(expectedStates.loading);
    });

    it('Обновление состояние на success при getOrder.fulfilled', () => {
      const action = getOrder.fulfilled(orderTestResponse, '', 0);
      const state = createState(action);

      expect(state).toEqual(expectedStates.getOrderSuccess);
    });

    it('Обновление состояние на failed при getOrder.rejected', () => {
      const action = getOrder.rejected(new Error('Error'), '', 0);
      const state = createState(action);

      expect(state).toEqual(expectedStates.failed);
    });

    it('Очищение информации о заказе', () => {
      const action = resetOrderInfo();
      const state = createState(action, {
        ...initialState,
        orderData: orderTestResponse.orders[0],
        requestStatus: RequestStatus.Success
      });

      expect(state.orderData).toBeNull();
    });
  });
});
