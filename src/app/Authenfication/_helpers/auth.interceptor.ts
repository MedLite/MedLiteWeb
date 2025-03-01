
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHeaderResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import * as alertifyjs from 'alertifyjs'
import { TokenStorageService } from '../_services/token-storage.service';
import { BehaviorSubject, Observable, Subject, catchError, filter, finalize, map, switchMap, take, throwError } from 'rxjs';

import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../Shared/modal/modal.service';
import { ModalContentComponent } from '../../Shared/modal-content/modal-content.component';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog, private modalService: ModalService, private token: TokenStorageService, private router: Router, private route: ActivatedRoute) { }
  langSession: any;
  private requests: HttpRequest<any>[] = [];
  tokens: any;
  backendDown: Boolean = false;
  private lastNotificationTime = 0;
  private errorSubject = new Subject<HttpErrorResponse>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);

    this.tokens = this.token.getToken();
    this.langSession = sessionStorage.getItem("lang")
    const currentUrl = window.location.pathname;

    if (this.tokens != null) {

      if (currentUrl != '/login') {
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.tokens) });
      }


      // req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.tokens) });
      req = req.clone({ headers: req.headers.set("Accept-Language", this.langSession) });
      req = req.clone({ headers: req.headers.set("Login-Page", "Yes") });
      req = req.clone({ headers: req.headers.set('cache-control', 'no-cache') });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Methods", "POST, GET, PUT") });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Headers", "Content-Type") });

    }

    return next.handle(req)
      .pipe(
        map((event: any) => {

          if (event.status < 200 || event.status >= 300) {
            return throwError(event);
          }



          return event;
        }),

        catchError((response: HttpErrorResponse) => {
          // console.log("Erorrrr ", response)
          // if (response.error == null) {
          //   this.handleConnectionRefused(); //New function
          // } else
            if (response.status === 401) {
              this.handleBackendError401(req, response);
            } else if (response.status === 500 && !response.error == null) {
              this.handleBackendError500(response);
            }else if (response.status === 500 && response.error == null) {
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

        // catchError((error: any) => {
        //   else if (error instanceof HttpErrorResponse) {
        //     // Handle HTTP error codes (401, 500, etc.) after connection is confirmed
        //     if (error.status === 401) { this.handleBackendError401(req, error); }
        //     // ... other HTTP error handlers ...
        //     return throwError(() => error); //Re-throw HttpErrorResponse
        //   } else {
        //     this.handleGenericError(error);
        //     return throwError(() => new Error('An unexpected error occurred.')); //Generic error
        //   }
        // })
      );


  }

  get isLoading(): boolean {
    return this.requests.length > 0;
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


  LogOut() {
    sessionStorage.clear();
    this.reloadPage();
    this.router.navigate(['/login'], { relativeTo: this.route })
  }
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 10);
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

  close() {
    this.modalService.close();
  }

  private handleBackendError500(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;

      if (error.error?.description != undefined) {
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.notify(
          '<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/backend.gif" alt="image" >' +
          ` Error Backend`
        );


      } else {
        alertifyjs.set('notifier', 'position', 'top-left');
        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error?.description);
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

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];