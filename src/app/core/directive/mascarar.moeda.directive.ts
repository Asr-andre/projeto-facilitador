import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mascaraMoeda]'
})
export class MascaraMoedaDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput() {
    let value = this.el.nativeElement.value.replace(/\D/g, '');
    value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');
    this.el.nativeElement.value = `R$ ${value}`;
  }
}

//<input type="text" mascaraMoeda placeholder="Digite o valor" />
