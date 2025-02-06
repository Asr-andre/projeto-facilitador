import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[maxCaractere]'
})
export class MaxCaractereDirective {
  @Input() maxCaractere!: number; // Define o limite de caracteres

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value.length > this.maxCaractere) {
      input.value = input.value.substring(0, this.maxCaractere);
    }
  }
}
