import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  TemplateRef,
  Type,
  ViewContainerRef,
  createComponent,
} from '@angular/core';
import { ModalComponent } from './modal.component';
import { Options } from './modal-options';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // newModalComponent!: ComponentRef<ModalComponent>;
  options!: Options | undefined;
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;
  private modalClosedSubject = new Subject<void>();
  modalClosed$ = this.modalClosedSubject.asObservable();
  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(
    vcrOrComponent: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: Options
  ): void;

  open<C>(vcrOrComponent: Type<C>, options?: Options): void;

  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param2?: TemplateRef<Element> | Options,
    options?: Options
  ) : void  {
    if (this.modalComponentRef) { 
      return;
    }
    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.options = options;
    } else {
      this.openWithComponent(vcrOrComponent);
      this.options = param2 as Options | undefined;
    }
  }

  private openWithTemplate(
    vcr: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: Options
  ): void {
    vcr.clear();
    const embeddedView = vcr.createEmbeddedView(content);
    this.modalComponentRef = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [embeddedView.rootNodes],
    });
    this.setupCloseSubscription(this.modalComponentRef);
  }

  // private openWithComponent(component: Type<unknown>) {
  //   const newComponent = createComponent(component, {
  //     environmentInjector: this.injector,
  //   }); 
  //   this.newModalComponent = createComponent(ModalComponent, {
  //     environmentInjector: this.injector,
  //     projectableNodes: [[newComponent.location.nativeElement]],
  //   }); 
  //   document.body.appendChild(this.newModalComponent.location.nativeElement); 
  //   // Attach views to the changeDetection cycle
  //   this.appRef.attachView(newComponent.hostView);
  //   this.appRef.attachView(this.newModalComponent.hostView);
  // }

  private openWithComponent<T>(component: Type<T>, options?: Options): void {
    const componentRef = createComponent(component, { environmentInjector: this.injector });
    this.modalComponentRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[componentRef.location.nativeElement]],
    });
    document.body.appendChild(this.modalComponentRef.location.nativeElement);
    this.appRef.attachView(componentRef.hostView);
    this.appRef.attachView(this.modalComponentRef.hostView);
    this.setupCloseSubscription(this.modalComponentRef);
  }


  private setupCloseSubscription(componentRef: ComponentRef<ModalComponent>): void {
    componentRef.instance.close$.subscribe(() => { // Correctly subscribe to close$
      this.modalClosedSubject.next();
      this.modalComponentRef = null;
    });
  }

  close(): void {
    this.modalComponentRef?.instance.onClose(); //Call onClose() method.
  }
}
