import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[mascaraCpfCnpj]'
})
export class MascaraCpfCnpjDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const documentoLimpo = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Limita o tamanho do documento a 14 caracteres
    const documentoTruncado = documentoLimpo.substring(0, 14);

    if (documentoTruncado.length <= 11) {
      this.el.nativeElement.value = this.formatarCPF(documentoTruncado); // Aplica máscara de CPF
    } else {
      this.el.nativeElement.value = this.formatarCNPJ(documentoTruncado); // Aplica máscara de CNPJ
    }
  }

  private formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) =>
      p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
    );
  }

  private formatarCNPJ(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) =>
      p5 ? `${p1}.${p2}.${p3}/${p4}-${p5}` : `${p1}.${p2}.${p3}/${p4}`
    );
  }
}
