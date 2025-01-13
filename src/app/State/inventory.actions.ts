import { createAction, props } from '@ngrx/store';
import { Products } from './inventory.model';

export const LoadAllProducts = '[Inventory] LoadProducts';
export const LoadAllProductsSuccess = '[Inventory] Products loaded ';
export const LoadAllProductsFail = '[Inventory] Products Loading failure';

export const AddItem = '[Inventory] Add Item ';
export const AddItemSucess = '[Inventory] Add Item Success';

export const UpdateItem = '[Inventory] Update Item ';
export const UpdateItemSucess = '[Inventory] Update Item Success';

export const DeleteItem = '[Inventory] Delete Item';
export const DeleteItemSuccess = '[Inventory] Delete Item Success';


export const loadItem = createAction(LoadAllProducts);
export const loadItemSuccess = createAction(
  LoadAllProductsSuccess,
  props<{ list: Products[] }>()
);
export const loadItemFail = createAction(
  LoadAllProductsFail,
  props<{ err: string }>()
);

export const deleteItem = createAction(DeleteItem, props<{ itemId: number }>());
export const deleteItemSuccess = createAction(
  DeleteItemSuccess,
  props<{ itemId: number }>()
);

export const addItem = createAction(AddItem, props<{ data: Products }>());
export const addItemSuccess = createAction(
  AddItemSucess,
  props<{ data: Products }>()
);

export const updateItem = createAction(UpdateItem, props<{ data: Products }>());
export const updateItemSuccess = createAction(
  UpdateItemSucess,
  props<{ data: Products }>()
);


export const emptyAction = createAction('empty');
