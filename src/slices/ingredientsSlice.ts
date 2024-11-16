import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient, RequestStatus } from '../utils/types';

type IngredientState = {
  ingredients: TIngredient[];
  requestStatus: RequestStatus;
};

const initialState: IngredientState = {
  ingredients: [],
  requestStatus: RequestStatus.Idle
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getIngredients.pending, (state) => {
        Object.assign(state, { requestStatus: RequestStatus.Loading });
      })
      .addCase(getIngredients.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          const ingredients = action.payload;
          state.requestStatus = RequestStatus.Success;
          state.ingredients = ingredients;
        }
      );
  },
  selectors: {
    selectIngredients(state: IngredientState) {
      return state.ingredients;
    },
    selectIngredientsStatus(state: IngredientState) {
      return state.requestStatus;
    }
  }
});

export const { selectIngredients, selectIngredientsStatus } =
  ingredientsSlice.selectors;
export const { reducer: ingredientsReducer } = ingredientsSlice;
