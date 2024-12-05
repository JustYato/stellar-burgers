import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetBurgerConstructor,
  initialState
} from '../burgerConstructorSlice';

describe('burgerConstructorSlice', () => {
  const stateWithIngredients = {
    bun: {
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
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0,
      id: '3208b522-f6f2-4f8a-8aed-22456fa1c230'
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        __v: 0,
        id: 'a7d85513-b88c-4ea6-814e-4a926557dcf2'
      },
      {
        _id: '643d69a5c3f7b9001cfa0945',
        name: 'Соус с шипами Антарианского плоскоходца',
        type: 'sauce',
        proteins: 101,
        fat: 99,
        carbohydrates: 100,
        calories: 100,
        price: 88,
        image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
        __v: 0,
        id: '9da49e27-e5ea-42d7-b521-aa1ffeb74962'
      }
    ]
  };

  const createState = (action: any, state = initialState) =>
    burgerConstructorSlice.reducer(state, action);

  describe('Тесты редьюсера burgerConstructorSlice', () => {
    it('Добавление булки в конструктор', () => {
      const action = addIngredient(stateWithIngredients.bun);
      const state = createState(action);

      expect(state).toEqual({ bun: action.payload, ingredients: [] });
    });

    it('Добавление ингредиента в конструктор', () => {
      const action = addIngredient(stateWithIngredients.ingredients[0]);
      const state = createState(action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(action.payload);
      expect(state.bun).toBeNull();
    });

    it('Перемещение ингредиента вверх', () => {
      const action = moveUpIngredient(1);
      const state = createState(action, stateWithIngredients);

      expect(state.ingredients[0].id).toBe(
        stateWithIngredients.ingredients[1].id
      );
      expect(state.ingredients[1].id).toBe(
        stateWithIngredients.ingredients[0].id
      );
    });

    it('Перемещение ингредиента вниз', () => {
      const action = moveDownIngredient(0);
      const state = createState(action, stateWithIngredients);

      expect(state.ingredients[0].id).toBe(
        stateWithIngredients.ingredients[1].id
      );
      expect(state.ingredients[1].id).toBe(
        stateWithIngredients.ingredients[0].id
      );
    });

    it('Удаление ингредиента из конструктора', () => {
      const action = removeIngredient(stateWithIngredients.ingredients[0]);
      const state = createState(action, stateWithIngredients);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe(
        stateWithIngredients.ingredients[1].id
      );
    });

    it('Reset конструктора', () => {
      const action = resetBurgerConstructor();
      const state = createState(action, stateWithIngredients);

      expect(state).toEqual(initialState);
    });
  });
});
