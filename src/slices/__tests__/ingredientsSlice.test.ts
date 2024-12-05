import { TIngredient, RequestStatus } from '../../utils/types';
import {
  ingredientsSlice,
  getIngredients,
  IngredientState,
  initialState
} from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  const testIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    }
  ];

  describe('Тест редьюсера ingredientsSlice', () => {
    const expectedSuccessState: IngredientState = {
      requestStatus: RequestStatus.Success,
      ingredientsData: testIngredients
    };

    const createState = (action: any, state = initialState) =>
      ingredientsSlice.reducer(state, action);

    it('Ожидание запроса на получение списка', () => {
      const action = { type: getIngredients.pending.type };
      const state = createState(action);

      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Успешное получение списка', () => {
      const action = getIngredients.fulfilled(testIngredients, '');
      const state = createState(action);

      expect(state).toEqual(expectedSuccessState);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Неудачное получение списка', () => {
      const expectedFailedState: IngredientState = {
        ...initialState,
        requestStatus: RequestStatus.Failed
      };
      const action = getIngredients.rejected(new Error('Error'), '');
      const state = createState(action);

      expect(state).toEqual(expectedFailedState);
      expect(state.requestStatus).toBe(RequestStatus.Failed);
    });
  });
});
