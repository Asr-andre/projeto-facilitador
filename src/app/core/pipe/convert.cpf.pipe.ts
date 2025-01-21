import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../helpers/utils';

@Pipe({
  name: 'convertCpf'
})
export class ConvertCpfPipe implements PipeTransform {

  transform(cpfCnpj: any, utilizaLgpd?: any, identificador?: string): any {
    if ((identificador != null) && (cpfCnpj != identificador)) {
      return identificador;
    }

    if((cpfCnpj != undefined) && (cpfCnpj != null) && (cpfCnpj != '')) {
      const cleanedCpfOuCnpj = cpfCnpj.replace(/[^\d]+/g, '');

      // Verifica se o valor é um CPF ou CNPJ
      if (cleanedCpfOuCnpj.length === 14) {
        const tipoPessoa = Utils.validaTipoPessoa(cleanedCpfOuCnpj);

        if (tipoPessoa === 'CPF') {
          let cpf = this.formatCPF(cleanedCpfOuCnpj);

          // Aplicar a LGPD para ocultar parte do CPF, se utilizaLgpd for 'S'
          if (utilizaLgpd === 'S') {
            cpf = `${cleanedCpfOuCnpj.substr(3, 3)}.***.***-${cleanedCpfOuCnpj.substr(12, 2)}`;
          }
          return cpf;
        } else if (tipoPessoa === 'CNPJ') {
          let cnpj = this.formatCNPJ(cleanedCpfOuCnpj);

          // Aplicar a LGPD para ocultar parte do CNPJ, se utilizaLgpd for 'S'
          if (utilizaLgpd === 'S') {
            cnpj = `${cleanedCpfOuCnpj.substr(0, 2)}.${cleanedCpfOuCnpj.substr(2, 3)}.***/${cleanedCpfOuCnpj.substr(8, 4)}-${cleanedCpfOuCnpj.substr(12, 2)}`;
          }
          return cnpj;
        } else {
          return cleanedCpfOuCnpj;
        }
      }
    } else {
      return '';
    }

  }

  // Função para formatar CPF
  formatCPF(cpfCnpj: string): string {
    return `${cpfCnpj.substr(3, 3)}.${cpfCnpj.substr(6, 3)}.${cpfCnpj.substr(9, 3)}-${cpfCnpj.substr(12, 2)}`;
  }

  // Função para formatar CNPJ
  formatCNPJ(cpfCnpj: string): string {
    return `${cpfCnpj.substr(0, 2)}.${cpfCnpj.substr(2, 3)}.${cpfCnpj.substr(5, 3)}/${cpfCnpj.substr(8, 4)}-${cpfCnpj.substr(12, 2)}`;
  }

}
