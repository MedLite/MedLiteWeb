import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { Options } from './modal-options';
import { Observable, Subject, fromEvent, of, zip } from 'rxjs';


import * as alertifyjs from 'alertifyjs'
import { Router } from '@angular/router';
import { AuthService } from '../../Authenfication/JWT/_services/auth.service';
import { StorageService } from '../../Authenfication/JWT/_services/storage.service';
import { map } from 'lodash';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class ModalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: Options | undefined;
  modalAnimationEnd!: Observable<Event>;
  modalLeaveAnimation!: string;
  overlayLeaveAnimation!: string;
  overlayAnimationEnd!: Observable<Event>;
  modalLeaveTiming!: number;
  overlayLeaveTiming!: number;


  close$ = new Subject<void>();


  constructor(private authService: AuthService, private router: Router, private storageService: StorageService,
    private modalService: ModalService,
    private element: ElementRef
  ) { }

  @HostListener('document:keydown.escape')
  // onEscape() {
  //   this.modalService.close();
  // }

  onEscape() {
    this.close();
  }

  onClose() {
    // outside click
    // this.modalService.close();
  }

  ngAfterViewInit() {
    this.options = this.modalService.options;
    this.addOptions();
    this.addEnterAnimations();
  }

  // addEnterAnimations() {
  //   this.modal.nativeElement.style.animation =
  //     this.options?.animations?.modal?.enter || '';
  //   this.overlay.nativeElement.style.animation =
  //     this.options?.animations?.overlay?.enter || '';
  // }
  addEnterAnimations() {
    this.modal.nativeElement.style.animation = this.options?.animations?.modal?.enter || '';
    this.overlay.nativeElement.style.animation = this.options?.animations?.overlay?.enter || '';
  }

  // addOptions() {
  //   // Style overload
  //   this.modal.nativeElement.style.minWidth =
  //     this.options?.size?.minWidth || 'auto';
  //   this.modal.nativeElement.style.width = this.options?.size?.width || 'auto';
  //   this.modal.nativeElement.style.maxWidth =
  //     this.options?.size?.maxWidth || 'auto';
  //   this.modal.nativeElement.style.minHeight =
  //     this.options?.size?.minHeight || 'auto';
  //   this.modal.nativeElement.style.height =
  //     this.options?.size?.height || '215px';
  //   this.modal.nativeElement.style.maxHeight =
  //     this.options?.size?.maxHeight || 'auto';
  //   this.modal.nativeElement.style.border =
  //     this.options?.border || '1px solid #ff0000';
  //     this.modal.nativeElement.style.borderRadius =
  //     this.options?.borderRadius || '6px';


  //   this.modalLeaveAnimation = this.options?.animations?.modal?.leave || '';
  //   this.overlayLeaveAnimation = this.options?.animations?.overlay?.leave || '';

  //   this.modalAnimationEnd = this.animationendEvent(this.modal.nativeElement);
  //   this.overlayAnimationEnd = this.animationendEvent(
  //     this.overlay.nativeElement
  //   );

  //   this.modalLeaveTiming = this.getAnimationTime(this.modalLeaveAnimation);
  //   this.overlayLeaveTiming = this.getAnimationTime(this.overlayLeaveAnimation);
  // }

  addOptions() {
    this.modal.nativeElement.style.minWidth = this.options?.size?.minWidth || 'auto';
    this.modal.nativeElement.style.width = this.options?.size?.width || 'auto';
    this.modal.nativeElement.style.maxWidth = this.options?.size?.maxWidth || 'auto';
    this.modal.nativeElement.style.minHeight = this.options?.size?.minHeight || 'auto';
    this.modal.nativeElement.style.height = this.options?.size?.height || '215px';
    this.modal.nativeElement.style.maxHeight = this.options?.size?.maxHeight || 'auto';
    this.modal.nativeElement.style.border = this.options?.border || '1px solid #ff0000';
    this.modal.nativeElement.style.borderRadius = this.options?.borderRadius || '6px';

    this.modalLeaveAnimation = this.options?.animations?.modal?.leave || '';
    this.overlayLeaveAnimation = this.options?.animations?.overlay?.leave || '';

    this.modalAnimationEnd = this.animationendEvent(this.modal.nativeElement);
    this.overlayAnimationEnd = this.animationendEvent(this.overlay.nativeElement);

    this.modalLeaveTiming = this.getAnimationTime(this.modalLeaveAnimation);
    this.overlayLeaveTiming = this.getAnimationTime(this.overlayLeaveAnimation);
  }

  animationendEvent(element: HTMLDivElement): Observable<Event> {
    return fromEvent(element, 'animationend');
  }

  removeElementIfNoAnimation(element: HTMLDivElement, animation: string) {
    if (!animation) {
      element.remove();
    }
  }



  close() {
    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;

    if (!this.modalLeaveAnimation && !this.overlayLeaveAnimation) {
      this.modalService.options = undefined;
      this.element.nativeElement.remove();
      this.close$.next();
      return;
    }

    this.removeElementIfNoAnimation(this.modal.nativeElement, this.modalLeaveAnimation);
    this.removeElementIfNoAnimation(this.overlay.nativeElement, this.overlayLeaveAnimation);

    //Improved animation handling
    const modalTime = this.getAnimationTime(this.modalLeaveAnimation);
    const overlayTime = this.getAnimationTime(this.overlayLeaveAnimation);
    const longestAnimationTime = Math.max(modalTime, overlayTime);

    const animationEnd$ = longestAnimationTime > 0 ?
      (modalTime >= overlayTime ? this.modalAnimationEnd : this.overlayAnimationEnd) :
      of(null); // Emit null if no animation

    // Both elements are animated, remove modal as soon as longest one ends
    if (this.modalLeaveTiming > this.overlayLeaveTiming) {
      this.modalAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else if (this.modalLeaveTiming < this.overlayLeaveTiming) {
      this.overlayAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else {
      zip(this.modalAnimationEnd, this.overlayAnimationEnd).subscribe(() => {
        this.element.nativeElement.remove();
      });
    }



    this.modalService.options = undefined;
  }

  ngOnDestroy() {
    this.close$.complete();
  }
  getAnimationTime(animation: string): number {
    const match = animation.match(/(\d+(\.\d+)?)(ms|s)/);
    return match ? parseFloat(match[1]) * (match[3] === 'ms' ? 0.001 : 1) : 0;
  }
  form: any = {
    userName: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  countries: any;

  selectedCountry: any;
  onSubmit(): void {
    const { userName, password } = this.form;

    this.authService.login(userName, password).subscribe(
      (data: any) => {
        console.log("data", data);
        this.storageService.saveUser(data);


        sessionStorage.setItem("userName", userName);

        sessionStorage.setItem("lang", this.selectedCountry.value);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;

        this.reloadPage();



      },
      // err => {
      //   if ([500].includes(err.status)) {
      //     alertifyjs.set('notifier', 'position', 'top-left');
      //     alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;font-size: 15px !important;;""></i>' + ` Service Core Not Available 503`);
      //     this.playSoundError();
      //   }


      //   this.isLoginFailed = true;

      // }
    );
  }
  playSoundError() {
    let audio = new Audio();
    audio.src = "../assets/son/erro.mp3";
    audio.load();
    audio.play();
  }
  reloadPage(): void {
    window.location.reload();
    this.router.navigate(['home']);

  }
}
