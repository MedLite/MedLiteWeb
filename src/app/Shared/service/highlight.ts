import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMenuActive]'
})
export class MenuActiveDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('opened')
  onOpened() {
    this.renderer.addClass(this.el.nativeElement.closest('.block2'), 'active');
  }

  @HostListener('closed')
  onClosed() {
    this.renderer.removeClass(this.el.nativeElement.closest('.block2'), 'active');
  }
}