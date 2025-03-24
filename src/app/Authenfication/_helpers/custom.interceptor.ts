// import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { catchError, throwError } from 'rxjs';
// import { ParametargeService } from '../../menu-parametrage/ServiceClient/parametarge.service';
// import * as alertifyjs from 'alertifyjs'
// export const customInterceptor: HttpInterceptorFn = (req, next) => {

//   const paramSRV = inject(ParametargeService);
//   let loggedUserData: any;
//   const localData = localStorage.getItem('angular17TokenData');
//   if (localData != null) {
//     loggedUserData = JSON.parse(localData);
//   }
//   // const token = localStorage.getItem('loginTOken');
//   // const token = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.token;
//   const authUser = JSON.parse(localStorage.getItem("auth-user") ?? '{}'); // Changed to localStorage
//   const expiration = authUser?.expiration;

//   const token = authUser?.token;
//   const lastNotificationTime = 0 ;
//   const cloneRequest = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   return next(cloneRequest).pipe(
//     catchError((error: HttpErrorResponse) => {
//       // const ExpDateTime = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.expiration;
//       const expirationDate = expiration ? new Date(expiration) : null;
//       const now = new Date();
//       if (error.status === 401 && expirationDate && expirationDate <= now) {
//         const isRefrsh = confirm("Your Session is Expred. Do you want to Continue");
//         if (isRefrsh) {
//           paramSRV.$refreshToken.next(true);
//         }
//         console.log("time now front now ", now);
//         console.log("expirationDate  back  ", expirationDate);
//         console.warn("Token expired but no expiration time found in storage.")

//       } else if (error.status === 500 && error.error != null) {
//         // this.handleBackendError500(error);
//       } else if (error.status === 500 && error.error == null) {
//         // this.handleConnectionRefused();
//       } else if (error.status === 404) {
//         // this.handleBackendError404(error);
//       } else if (error.status === 409) {
//         // this.handleBackendError409(error)
//       } else if (error.status === 400) {
//         const currentTime = Date.now();
//         if (currentTime - 0 > 1000) {
//           // 0 = currentTime;
//           alertifyjs.set('notifier', 'position', 'top-left');
//           alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/error.gif" alt="image" >' + error.error?.description);

//         }
//       } else if (error.status === 403) {
//         // this.handleBackendError403(error)
//       }


//       return throwError(error)
//     })
//   );
// };


