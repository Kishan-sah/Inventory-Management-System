import { createReducer, on } from '@ngrx/store';
import { productState } from './store';
import {
  addItemSuccess,
  deleteItemSuccess,
  loadItemFail,
  loadItemSuccess,
  updateItemSuccess,
} from './inventory.actions';

const productReducer = createReducer(
  productState,
  // Handle successful product loading
  on(loadItemSuccess, (state, action) => ({
    ...state,
    list: action.list,
    errormessage: '',
  })),
  // Handle failed product loading
  on(loadItemFail, (state, action) => ({
    ...state,
    list: [],
    errormessage: action.err,
  })),
  // Handle item addition
  on(addItemSuccess, (state, action) => ({
    ...state,
    list: [...state.list, action.data],
    errormessage: '',
  })),
  // Handle item update
  on(updateItemSuccess, (state, action) => ({
    ...state,
    list: state.list.map((product) =>
      product.id === action.data.id ? action.data : product
    ),
    errormessage: '',
  })),
   // Handle item deletion
   on(deleteItemSuccess, (state, action) => ({
    ...state,
    list: state.list.filter((product) => product.id !== action.itemId),
    errormessage: '',
  })),
);
// Export Reducer Function
export function ProductReducer(state: any, action: any) {
  return productReducer(state, action);
}
