import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { APIService } from "../api.service";
import {
  addItem,
  addItemSuccess,
  deleteItem,
  deleteItemSuccess,
  loadItem,
  loadItemSuccess,
  updateItem,
  updateItemSuccess
} from "./inventory.actions";

@Injectable()
export class ProductEffects {
  actions$ = inject(Actions);
  service = inject(APIService);
  toastr = inject(ToastrService);

  // Load Products
  loadProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItem),
      exhaustMap(() =>
        this.service.getProducts().pipe(
          map((data) => loadItemSuccess({ list: data })),
          catchError((err) => of(this.ShowAlert(err.message, "fail")))
        )
      )
    )
  );

  // Add Product
  addProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem),
      switchMap((action) =>
        this.service.Create(action.data).pipe(
          switchMap((response) =>
            of(
              addItemSuccess({ data: action.data }),
              this.ShowAlert("Item added successfully", "pass")
            )
          ),
          catchError((err) => of(this.ShowAlert(err.message, "fail")))
        )
      )
    )
  );

  // Update Product
  updateProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(updateItem),
      switchMap((action) =>
        this.service.Update(action.data.id, action.data).pipe(
          switchMap((response) =>
            of(
              updateItemSuccess({ data: action.data }),
              this.ShowAlert("Item updated successfully", "pass")
            )
          ),
          catchError((err) => of(this.ShowAlert(err.message, "fail")))
        )
      )
    )
  );

  // Delete Product
  deleteProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteItem),
      switchMap((action) =>
        this.service.Delete(action.itemId).pipe(
          switchMap(() =>
            of(
              deleteItemSuccess({ itemId: action.itemId }),
              this.ShowAlert("Item deleted successfully", "pass")
            )
          ),
          catchError((err) => of(this.ShowAlert(err.message, "fail")))
        )
      )
    )
  );

  // Show Alert Method
  ShowAlert(message: string, response: string) {
    if (response === "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
    return { type: "NO_ACTION" }; // Return an empty action to satisfy NgRx
  }
}
