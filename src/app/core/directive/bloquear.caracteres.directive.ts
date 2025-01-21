import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[bloquearCaracteresEspeciais]'
})
export class BloquearCaracteresEspeciaisDirective {
  regex: RegExp = new RegExp(/^[a-zA-Z0-9 ]*$/);

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
