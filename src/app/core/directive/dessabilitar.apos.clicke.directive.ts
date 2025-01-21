import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[desabilitarAoClicar]'
})
export class DesabilitarAoClicarDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick() {
    this.el.nativeElement.setAttribute('disabled', 'true');
  }
}
