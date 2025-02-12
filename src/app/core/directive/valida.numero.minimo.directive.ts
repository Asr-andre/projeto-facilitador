import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appValidaNumeroMinimo]'
})
export class ValidaNumeroMinimoDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = Number(input.value);

    // Se o valor for menor que 1, redefine para 1
    if (value < 1) {
      input.value = '1'; // Ajusta para 1
    }

    // Se o valor for 0, redefine para 1
    if (input.value === '0') {
      input.value = '1'; // Ajusta para 1
    }
  }
}
