import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(req); // Add the request to the array

    return next.handle(req).pipe(
      finalize(() => { 
        // Regardless of success or error, remove the request
        this.requests = this.requests.filter(x => x !== req);
      })
    );
  }

  get isLoading(): boolean {
    return this.requests.length > 0;
  }
}