import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const jwtToken = getJwtToken();

  if (jwtToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return next(clonedReq);
  }

  return next(req);
};

function getJwtToken(): string | null {
  const tokens = localStorage.getItem('JWT_TOKEN');
  if (!tokens) return null;
  const parsedToken = JSON.parse(tokens);
  return parsedToken.access_token;
}
