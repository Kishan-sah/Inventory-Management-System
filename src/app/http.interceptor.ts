import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userFriendlyMessage = 'An unexpected error occurred.';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('Client-side error:', error.error.message);
        userFriendlyMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        console.error(`Server-side error: Code ${error.status}, Message: ${error.message}`);
        switch (error.status) {
          case 0:
            userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection or try again later.';
            break;
          case 400:
            userFriendlyMessage = 'Bad Request. Please check the submitted data.';
            break;
          case 401:
            userFriendlyMessage = 'Unauthorized. Please log in.';
            break;
          case 403:
            userFriendlyMessage = 'Forbidden. You don’t have permission to access this resource.';
            break;
          case 404:
            userFriendlyMessage = 'Resource not found. Please try again.';
            break;
          case 500:
            userFriendlyMessage = 'A server error occurred. Please try again later.';
            break;
          default:
            userFriendlyMessage = `Error ${error.status}: ${error.message}`;
        }
      }

      // Display the error message in a snackbar
      snackBar.open(userFriendlyMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      // Pass the error to the next handler
      return throwError(() => new Error(userFriendlyMessage));
    })
  );
};
