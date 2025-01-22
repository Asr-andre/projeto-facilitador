import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMaiuscula], [appMinuscula]'
})
export class ConverterTextoDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement.value;
    if (input && typeof input === 'string') {
      const novoValorMaiuscula = input.replace(/\b\w/g, (letra: string) => letra.toUpperCase());
      const novoValorMinuscula = input.toLowerCase();

      if (this.el.nativeElement.hasAttribute('appMaiuscula')) {
        this.control.control?.setValue(novoValorMaiuscula, { emitEvent: false });
      } else if (this.el.nativeElement.hasAttribute('appMinuscula')) {
        this.control.control?.setValue(novoValorMinuscula, { emitEvent: false });
      }
    }
  }
}
