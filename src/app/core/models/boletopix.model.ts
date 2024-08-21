export class RequisicaoBoletoPixModel {
  id_empresa: number;
  id_cliente: number;
  user_login: string;
}

export class BoletoPixModel {
  id_boleto: string;
  nosso_numero: string;
  data_vencimento: string;
  data_emissao: string;
  user_login: string;
  valor_boleto: number;
  situacao: string;
  pixcopiacola: string;
}

export interface RespostaBoletoPixModel {
  success: string;
  msg: string;
  id_empresa: number;
  id_cliente: number;
  boletos: BoletoPixModel[];
}
