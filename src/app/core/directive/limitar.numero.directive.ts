import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[limiteCaracteres]'
})
export class LimiteCaracteresDirective {
  @Input('limiteCaracteres') maxLength!: number;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let input = this.el.nativeElement as HTMLInputElement;
    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
    }
  }
}

//<input type="text" limiteCaracteres="10" placeholder="Máximo 10 caracteres" />
