import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';

import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import * as alertifyjs from 'alertifyjs'
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { ModalService } from '../../../Shared/modal/modal.service';
import { ModalContentComponent } from '../../../Shared/modal-content/modal-content.component';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
  ) { }
  tokens: any;
  langSession: any;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.tokens = this.storageService.getUser();
    const currentUrl = window.location.pathname;
    // console.log("toknessss", this.tokens.accessToken)
    this.langSession = sessionStorage.getItem("lang")
    req = req.clone({
      withCredentials: true,
    });
    if (this.tokens != null) {

      if (currentUrl != '/login') {
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.tokens.accessToken) });

      }
      req = req.clone({ headers: req.headers.set("Accept-Language", this.langSession) });
      // req = req.clone({ headers: req.headers.set("Login-Page", "Yes") });
      req = req.clone({ headers: req.headers.set('cache-control', 'no-cache') });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Methods", "POST, GET, PUT") });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Headers", "Content-Type") });

    }


    return next.handle(req).pipe(
      // catchError((error) => {
      //   if ( error instanceof HttpErrorResponse && !req.url.includes('authentification/signin') 
      //     && error.status === 401 ) {
      //     return this.handleBackendError401(req, next);
      //   }

      //   return throwError(() => error);
      // })
      catchError((response: HttpErrorResponse) => {
        console.log("error response   ", response)
        // console.log("Erorrrr ", response)
        // if (response.error == null) {
        //   this.handleConnectionRefused(); //New function
        // } else
        if (response.status === 401) {
          this.handleBackendError401(req, response);
        } else if (response.status === 500 && response.error != null) {
          this.handleBackendError500(response);
        } else if (response.status === 500 && response.error == null) {
          this.handleConnectionRefused();
        } else if (response.status === 404) {
          this.handleBackendError404(response);
        } else if (response.status === 409) {
          this.handleBackendError409(response)
        } else if (response.status === 400) {
          this.handleBackendError400(response)
        } else if (response.status === 403) {
          this.handleBackendError403(response)
        }

        // else{
        //   this.handleGenericError(response);
        // }

        return throwError("Error Not Exist!");
      }

      )
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.tokens = this.storageService.getUser();
      if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken(this.tokens.refreshToken, this.tokens.id).pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private lastNotificationTime = 0;
  private handleBackendError401(request: HttpRequest<any>, errorResp: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/expSession.png" alt="image" >' + errorResp.error?.description);
      const currentUrl = window.location.pathname;

      if (currentUrl !== '/login') {
        this.openModalComponent();
      }

    }
  }
  openModalComponent() {
    this.modalService.open(ModalContentComponent, {
      ignoreBackdropClick: true,
      backdrop: 'static',
      keyboard: false,
      focus: true,
      disableClose: true,
    });

  }


  
  private handleConnectionRefused() {
    // const currentTime = Date.now();
    // if (currentTime - this.lastNotificationTime > 2000) {
    //   this.lastNotificationTime = currentTime;
    //   alertifyjs.set('notifier', 'position', 'top-left');
    //   alertifyjs.error('Backend server not reachable. Please check your network connection and try again.');

    // }

    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 1000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >   Backend server not reachable. Please check your network connection and try again.');


    }


  }

  private handleGenericError(error: any) {
    console.error('Unhandled error:', error); //For debugging
    // ... your generic error handling ...
  }


 


   

  close() {
    this.modalService.close();
  }

  private handleBackendError500(error: HttpErrorResponse) {
   
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
  

      if (error.error.description == undefined) {
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.notify(
          '<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/backend.gif" alt="image" >' +
          ` Error Backend`
        );


      } else {
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error.description);
        console.log("ERrrororrrrrrrrrororororor")

      }

    }
  }


  private handleBackendError403(error: HttpErrorResponse) {

    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >   Token has expired');
      const currentUrl = window.location.pathname;

      if (currentUrl !== '/login') {
        this.openModalComponent();
      }

    }
  }


  


  private handleBackendError409(errorResp: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      if (errorResp.error?.type == 'application/json') {

        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" > لا توجد بيانات');

      } else {
        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + errorResp.error?.description);

      }
    }
  }

  private handleBackendError400(errorResp: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');


      // alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + errorResp.error?.fieldErrors[0].field + ' ' + errorResp.error?.fieldErrors[0].message + ' From Core ');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + errorResp.error?.description);



    }
  }

  private handleBackendError404(errorResp: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + errorResp.error?.error);

    }
  }

}


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];