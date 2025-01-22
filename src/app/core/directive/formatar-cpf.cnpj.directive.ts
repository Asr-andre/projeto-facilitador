import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appcpfCnpj]'
})
export class FormatarDocumentoDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const valor = input.value;
    input.value = this.formatarDocumento(valor);
  }

  private formatarDocumento(documento: string): string {
    const documentoLimpo = documento.replace(/\D/g, '');

    if (documentoLimpo.length === 11) {
      return this.formatarCPF(documentoLimpo);
    } else if (documentoLimpo.length === 14) {
      return this.formatarCNPJ(documentoLimpo);
    } else {
      return documento;
    }
  }

  private formatarCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return cnpj;
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  private formatarCPF(cpf: string): string {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
