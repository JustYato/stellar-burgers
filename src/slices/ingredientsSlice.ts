import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
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
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.requestStatus = RequestStatus.Success;
          state.ingredients = action.payload;
        }
      );
  }
});

const selectIngredientState = (state: { ingredients: IngredientState }) =>
  state.ingredients;

export const selectIngredients = createSelector(
  selectIngredientState,
  (state) => state.ingredients
);
export const selectIngredientsStatus = createSelector(
  selectIngredientState,
  (state) => state.requestStatus
);
export const ingredientsReducer = ingredientsSlice.reducer;
