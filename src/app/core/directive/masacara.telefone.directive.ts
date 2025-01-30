import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[telefoneMask]'
})
export class TelefoneMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    let input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    // Limita a quantidade de caracteres para 11 (máximo de celular com 9 dígitos)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica a máscara de telefone fixo
    if (value.length <= 10) {
      input.value = this.formatFixo(value);
    }
    // Aplica a máscara de celular (inclui o 9º dígito)
    else if (value.length > 10 && value.length <= 11) {
      input.value = this.formatCelular(value);
    }
  }

  private formatFixo(value: string): string {
    if (value.length <= 2) {
      return `(${value}`;
    } else if (value.length <= 6) {
      return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
    }
  }

  private formatCelular(value: string): string {
    if (value.length <= 2) {
      return `(${value}`;
    } else if (value.length === 3) {
      return `(${value.slice(0, 2)}) ${value.slice(2)} `;
    } else if (value.length <= 7) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}`;
    } else {
      return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
  }
}
