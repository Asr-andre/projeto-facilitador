import { SolicitarCreditosService } from './../services/solicitar.creditos.service';
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

  public static CopyAreaTransfer(value) {
    const texto = value;
    //Cria um elemento input (pode ser um textarea)
    let inputTest = document.createElement("input");
    inputTest.value = texto;
    //Anexa o elemento ao body
    document.body.appendChild(inputTest);
    //seleciona todo o texto do elemento
    inputTest.select();
    //executa o comando copy
    //aqui é feito o ato de copiar para a area de trabalho com base na seleção
    document.execCommand('copy');
    //remove o elemento
    document.body.removeChild(inputTest);
  }

  public static carregarConteudoCompleto(parametro: any, campo: string): string {
    if (parametro && parametro[campo]) {
      return parametro[campo]
    } else {
      return '';
    }
  }

  static genId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public static removeCaracteresEspeciais(valor, tipo) {
    if (valor == undefined || valor == null) return;
    if ((tipo != 3) && (tipo != 4)) {
      if (tipo != 6) {
        if ((tipo != 7) && (tipo != 8) && (tipo != 14) && (tipo != 16)) {
          return valor.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
        } else {
          return valor;
        }
      } else {
        return valor;
      }

    } else {
      return valor;
    }
  }

  public static AbrirPdfBase64(bytes) {
    var link = "data:application/pdf;base64, " + bytes;
    fetch(link).then(res => res.blob()).then(res => window.open(URL.createObjectURL(res), '_blank'));
  }

  static isNullOrUndefined<T>(object: T | undefined | null) {
    return <T>object == undefined && <T>object == null;
  }

  public static validaTipoPessoa(cpfOuCnpj) {
    // Remove possíveis formatações como pontos e traços
    const cleanedCpfOuCnpj = cpfOuCnpj.replace(/[^\d]+/g, '');

    // Todos os CPFs e CNPJs têm 14 dígitos
    if (cleanedCpfOuCnpj.length === 14) {
      const primeirosDigitos = cleanedCpfOuCnpj.slice(0, 3);
      const ultimosOnzeDigitos = cleanedCpfOuCnpj.slice(-11);

      // Verifica se os 3 primeiros dígitos são zeros (possível CPF)
      if (primeirosDigitos === '000') {
        // Tenta validar como CPF
        if (this.validateCPF(ultimosOnzeDigitos)) {
          return "CPF"; // Retorna CPF se válido
        }
      }

      // Se a validação de CPF falhar ou os primeiros dígitos não forem '000', tenta validar como CNPJ
      if (this.validateCNPJ(cleanedCpfOuCnpj)) {
        return "CNPJ"; // Retorna CNPJ se válido
      }
    }

    return "Inválido"; // Retorna inválido se nenhuma das validações for bem-sucedida
  }

  public static validateCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    let resto;

    // Cálculo do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    // Cálculo do segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Validação de CNPJ com cálculo dos dígitos verificadores
  public static validateCNPJ(cnpj) {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    // Cálculo do primeiro dígito verificador
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitos.charAt(0))) {
      return false;
    }

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    // Cálculo do segundo dígito verificador
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != parseInt(digitos.charAt(1))) {
      return false;
    }

    return true;
  }
}
