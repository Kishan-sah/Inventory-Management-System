import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3000/LoginData', user).pipe(
      tap((tokens: any) => this.doLoginUser(user.email, tokens))
    );
  }

  private doLoginUser(email: string, tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(tokens));
    console.log(tokens);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  getJwtToken(): string | null {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    return tokens ? JSON.parse(tokens).access_token : null;
  }
}
