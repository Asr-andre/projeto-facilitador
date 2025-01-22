import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appVerificarValorNegativo]'
})
export class VerificarValorNegativoDirective {
  @Input('appVerificarValorNegativo') formControl: FormControl;

  constructor(private el: ElementRef) {}

  // Previne a digitação de valores negativos, incluindo o sinal "-"
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const value = this.el.nativeElement.value;

    // Verifica se o valor contém o sinal de menos ou é negativo
    if (value.includes('-')) {
      this.el.nativeElement.value = 0;  // Corrige para 0 caso o usuário tenha tentado digitar "-"
      this.formControl.setValue(0); // Atualiza o FormControl com o valor corrigido
    }
  }

  // Verifica o valor ao perder o foco e corrige se necessário
  @HostListener('blur') onBlur() {
    this.verificarValorNegativo();
  }

  // Método para corrigir valor negativo ao perder o foco
  private verificarValorNegativo() {
    const valor = this.formControl.value;

    if (valor <= 0) {
      this.formControl.setValue(0);  // Define o valor como 0 se for negativo ou zero
    }
  }
}
