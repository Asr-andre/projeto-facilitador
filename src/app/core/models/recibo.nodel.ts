export class RequisicaoReciboModel {
  id_cliente: number;
  user_login: string;
}

export class RetornoReciboModel {
  success: string;
  msg: string;
  id_cliente: string;
  recibos: Recibos[];
}

export class Recibos {
  id_recibo: number;
  data_recibo: string;
  valor_recibo: number;
  cancel: string;
  titulos: string;
  data_cadastro: string;
}
