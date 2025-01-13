import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideToastr} from 'ngx-toastr'
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { APIService } from './api.service';
import { provideEffects } from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools'
import { ProductReducer } from './State/inventory.reducer';
import { ProductEffects } from './State/inventory.effects';
import { httpInterceptor } from './http.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes),
  provideHttpClient(
    withInterceptors([ httpInterceptor]) // Add the error handling interceptor for HTTP requests
  ),
  provideAnimations(),
  provideToastr(),
  provideStore({'product': ProductReducer}),
  provideEffects([ProductEffects]),
  provideStoreDevtools({
    maxAge:5,
    logOnly: true,
    autoPause:true,
    trace: false,
    
  }),
  APIService
] 
};
