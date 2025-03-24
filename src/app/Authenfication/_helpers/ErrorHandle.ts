import { HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { ModalContentComponent } from "../../Shared/modal-content/modal-content.component";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalService } from "../../Shared/modal/modal.service";
import { TokenStorageService } from "../_services/token-storage.service";
import * as alertifyjs from 'alertifyjs'


export class ErrorHandler {
    constructor(public dialog: MatDialog, private modalService: ModalService, private token: TokenStorageService, private router: Router, private route: ActivatedRoute) { }

    langSession: any;
    private requests: HttpRequest<any>[] = [];
    tokens: any;
    backendDown: Boolean = false;
    private lastNotificationTime = 0;
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