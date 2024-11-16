import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { TConstructorIngredient, TIngredient } from '../utils/types';

interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerConstructorState = {
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
          state.ingredients = [...state.ingredients, payload];
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
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveDownIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    resetBurgerConstructor(state) {
      Object.assign(state, { bun: null, ingredients: [] });
    }
  },
  selectors: {
    selectState(state: BurgerConstructorState) {
      return state;
    }
  }
});

export const { selectState } = burgerConstructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetBurgerConstructor
} = burgerConstructorSlice.actions;
export const { reducer: burgerConstructorReducer } = burgerConstructorSlice;
