
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import * as alertifyjs from 'alertifyjs'
import { TokenStorageService } from '../_services/token-storage.service';
import { Observable, Subject, Subscription, catchError, map, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../Shared/modal/modal.service';
import { ModalContentComponent } from '../../Shared/modal-content/modal-content.component';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private modalService: ModalService, private token: TokenStorageService,
     private router: Router, private route: ActivatedRoute,private cookieService: CookieService) { }
  langSession: any;
  private requests: HttpRequest<any>[] = [];
  tokens: any;
  backendDown: boolean = false;
  private lastNotificationTime = 0;
  private modalClosedSubscription: Subscription | null = null; //Subscription to handle modal close
  private modalIsOpen = false; // Flag to track modal state

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.tokens = this.token.getTokenUSer();
    this.langSession = sessionStorage.getItem("lang");
    const tk = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.token;


    req = req.clone({ headers: req.headers.delete("cookie" ) });
    if (this.tokens != null) {
      const currentUrl = window.location.pathname;
      if (currentUrl != '/login') {
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + tk) });
      } 
      // this.cookieService.delete('displayedContent');
      //    // ReportServer Authentication (improve security!)
      //    if (req.url == '/reports') {
        
      //     req = req.clone({ headers: req.headers.set('Cookie', 'ai_user=z6wB/etohOO0gSCql2aa2D|2025-04-04T23:26:04.039Z; ai_session=pBIqheev47KcODYtn6VnVC|1743824460704|1743824460704') });
      //   }
  
      req = req.clone({ headers: req.headers.set("Accept-Language", this.langSession) });
     
       req = req.clone({ headers: req.headers.set('cache-control', 'no-cache') });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Methods", "POST, GET, PUT") });
      req = req.clone({ headers: req.headers.set("Access-Control-Allow-Headers", "Content-Type") });
  
      req = req.clone({ headers: req.headers.set("Accept", "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7") });
      
    }

   

    return next.handle(req).pipe(
      map((event: any) => {
        if (event.status < 200 || event.status >= 300) {
          return throwError(() => event); // Use throwError to handle errors properly
        }
        return event;
      }),
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
          this.handleBackendError401(response);
        } else if (response.status === 500) {
          this.handleBackendError500(response);
        } else if (response.status === 404) {
          this.handleBackendError404(response);
        } else if (response.status === 409) {
          this.handleBackendError409(response);
        } else if (response.status === 400) {
          this.handleBackendError400(response);
        } else if (response.status === 403) {
          this.handleBackendError403(response);
        } else if (response.status === 0) {
          this.handleConnectionRefused();
        } else {
          this.handleGenericError(response);
        }
        return throwError(() => response); // Re-throw the error
      })
    );
  }

  // ... (isLoading getter remains the same) ...

  private handleConnectionRefused() {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 1000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >   Backend server not reachable. Please check your network connection and try again.');
    }
  }

  private handleGenericError(error: any) {
    console.error('Unhandled error:', error);
  }

  LogOut() {
    sessionStorage.clear();
    this.reloadPage();
    this.router.navigate(['/login'], { relativeTo: this.route });
  }
  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }

  openModalComponent() {
    if (!this.modalIsOpen) {
      this.modalIsOpen = true;
      this.modalClosedSubscription = this.modalService.modalClosed$.subscribe(() => {
        this.modalIsOpen = false;
        this.modalClosedSubscription?.unsubscribe();
        this.modalClosedSubscription = null;
      });
      this.modalService.open(ModalContentComponent);
    }
  }

  close() {
    this.modalService.close();
  }

  private handleBackendError500(error: HttpErrorResponse) {

    console.log("error  ", error)
    if (error.error === null) {


      const currentTime = Date.now();
      if (currentTime - this.lastNotificationTime > 2000) {
        this.lastNotificationTime = currentTime;
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.notify(
          '<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/backend.gif" alt="image" >' +
          ` Error Backend`
        );
      }



    } else {
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error.description);
    }

  }

  private handleBackendError403(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >   Token has expired');
      this.openModalComponent();
    }
  }

  private handleBackendError401(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/expSession.png" alt="image" >' + error.error?.description);
      this.openModalComponent();
    }
  }

  private handleBackendError409(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      if (error.error?.type === 'application/json') {
        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" > لا توجد بيانات');
      } else {
        alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error?.description);
      }
    }
  }

  private handleBackendError400(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error?.description);
    }
  }

  private handleBackendError404(error: HttpErrorResponse) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) {
      this.lastNotificationTime = currentTime;
      alertifyjs.set('notifier', 'position', 'top-left');
      alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error?.error);
    }
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];