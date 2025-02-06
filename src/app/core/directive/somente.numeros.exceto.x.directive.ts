import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[apenasNumerosX]'
})
export class ApenasNumerosXDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    // Permite apenas números (0-9) e a letra 'X' (maiúscula ou minúscula)
    const regex = /^[0-9Xx]$/;

    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove qualquer caractere inválido e converte 'x' para 'X'
    input.value = input.value.replace(/[^0-9Xx]/g, '').toUpperCase();
  }
}
