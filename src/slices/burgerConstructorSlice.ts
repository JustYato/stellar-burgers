import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { TConstructorIngredient, TIngredient } from '../utils/types';

export interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      }),
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const { payload } = action;
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      }
    },
    removeIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    },
    moveUpIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    moveDownIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    resetBurgerConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const selectBurgerState = (state: {
  burgerConstructor: BurgerConstructorState;
}) => state.burgerConstructor;

export const selectBun = createSelector(
  selectBurgerState,
  (state) => state.bun
);
export const selectIngredients = createSelector(
  selectBurgerState,
  (state) => state.ingredients
);
export const selectAllIngredients = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => (bun ? [bun, ...ingredients] : ingredients)
);
export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetBurgerConstructor
} = burgerConstructorSlice.actions;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
