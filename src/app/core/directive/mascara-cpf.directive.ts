import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[mascaraCpf]' // Altere o seletor para refletir o objetivo da diretiva
})
export class MascaraCpfDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const cpfLimpo = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Limita o tamanho do CPF a 11 caracteres
    const cpfTruncado = cpfLimpo.substring(0, 11);

    // Aplica a máscara de CPF
    this.el.nativeElement.value = this.formatarCPF(cpfTruncado);
  }

  private formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) =>
      p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
    );
  }
}
