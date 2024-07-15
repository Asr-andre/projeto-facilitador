import { AbstractControl } from "@angular/forms";

export class Utils {

  public static formatarDocumento(documento: string): string {
    const documentoLimpo = documento.replace(/\D/g, '');

    if (documentoLimpo.length === 11) {
      return this.formatarCPF(documentoLimpo);
    } else if (documentoLimpo.length === 14) {
      return this.formatarCNPJ(documentoLimpo);
    } else {
      return documento;
    }
  }

  private static formatarCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return cnpj;
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  private static formatarCPF(cpf: string): string {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public static formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length === 10) {
      return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (telefoneLimpo.length === 11) {
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  public static formatarCEP(cep: string): string {
    if (!cep) return '';
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return cep;
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  public static formatarNumeroResidencia(numero: string): string {
    if (!numero) return '';
    return `Nº ${numero}`;
  }


  public static dataBr(dataIso: string) {
    if (!dataIso) {
      return '';
    }

    const data = new Date(dataIso);
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;
    const dia = data.getDate();
    const hora = data.getHours();
    const minuto = data.getMinutes();

    const dataFormatada = `${this.addZeroEsquerda(dia)}/${this.addZeroEsquerda(mes)}/${ano} ${this.addZeroEsquerda(hora)}:${this.addZeroEsquerda(minuto)}`;

    return dataFormatada;
  }

  private static addZeroEsquerda(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  public static converterMaiuscula(campo: AbstractControl) {
    if (campo && typeof campo.value === 'string') {
      const novoValor = campo.value.replace(/\b\w/g, (letra: string) => letra.toUpperCase());
      campo.setValue(novoValor);
    }
  }

  public static converterMinuscula(campo: AbstractControl) {
    if (campo && typeof campo.value === 'string') {
      campo.setValue(campo.value.toLowerCase());
    }
  }

  public static somenteNumero(campo: AbstractControl) {
    if (campo && typeof campo.value === 'string') {
      const novoValor = campo.value.replace(/\D/g, '');
      campo.setValue(novoValor);
    }
  }

  public static dataAtual() {
    let today = new Date();
    let data = today.toISOString().split('T')[0];
    return data;
  }

  public static converterValorRealBrasil(valor) {
    const formatoRealBrasil: string = valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatoRealBrasil;
  }

  public static filtrar<T>(itens: T[], textoPesquisa: string): T[] {
    const textoPesquisaMinusculo = textoPesquisa.toLowerCase();
    return itens.filter(item =>
      Object.values(item).some(valor =>
        valor !== undefined && valor !== null && valor.toString().toLowerCase().includes(textoPesquisaMinusculo)
      )
    );
  }
}
