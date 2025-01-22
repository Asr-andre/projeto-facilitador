import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCep'
})
export class FormatarCepPipe implements PipeTransform {

  transform(cep: string): string {
    if (!cep) return cep;

    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      return this.formatarCEP(cepLimpo);
    } else {
      return cep;
    }
  }

  private formatarCEP(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return cep;
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
