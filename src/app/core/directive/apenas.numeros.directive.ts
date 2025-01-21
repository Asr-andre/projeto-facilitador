import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[apenasNumeros]'
})
export class ApenasNumerosDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}

//<input type="text" apenasNumeros placeholder="Digite apenas números" />
