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

  public static formatarDataParaExibicao(dataIso: string): string {
    if (!dataIso) return '';
    const data = new Date(dataIso);

    data.setHours(data.getHours() + 3);

    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    const segundo = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  public static dataBrasil(dataIso: string): string {
    if (!dataIso) return '';
    const data = new Date(dataIso);

    const ano = data.getUTCFullYear();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
    const dia = data.getUTCDate().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano}`;
}



  public static dataBr(dataIso: string): string {
    if (!dataIso) {
      return '';
    }

    // Cria um objeto Date com a data ISO
    const data = new Date(dataIso);

    // Obtém o fuso horário local
    const offset = data.getTimezoneOffset() * 60000;

    // Ajusta a data para o horário local
    const dataLocal = new Date(data.getTime() - offset);

    const ano = dataLocal.getFullYear();
    const mes = dataLocal.getMonth() + 1;
    const dia = dataLocal.getDate();
    const hora = dataLocal.getHours();
    const minuto = dataLocal.getMinutes();

    return `${this.addZeroEsquerda(dia)}/${this.addZeroEsquerda(mes)}/${ano} ${this.addZeroEsquerda(hora)}:${this.addZeroEsquerda(minuto)}`;
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

  public static alternarVisibilidadeSenha(campoId: string, iconeId: string): void {
    const campo = document.getElementById(campoId) as HTMLInputElement;
    const icone = document.getElementById(iconeId) as HTMLElement;

    if (campo && icone) {
      if (campo.type === 'password') {
        campo.type = 'text';
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye');
      } else {
        campo.type = 'password';
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash');
      }
    } else {
      console.error('Elementos não encontrados:', campoId, iconeId);
    }
  }
}
