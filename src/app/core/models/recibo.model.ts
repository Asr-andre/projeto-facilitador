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

//imprimir recibo
export class RequisicaoReciboImprimirModel {
  id_cliente: number;
  id_recibo: string;
  user_login: string;
}

export class RequisicaoRetornoImprimirModel {
  success: string;
  msg: string;
  id_empresa: string;
  base64: string;
}
