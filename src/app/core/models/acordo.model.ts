export class AcordoRequisicaoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  user_login: string;
}

export class AcordoModel {
  id_acordo: string;
  data_acordo: string;
  valor_acordo: number;
  qtde_parcelas_originais: number;
  qtde_parcelas: number;
  valor_entrada: number;
  valor_parcela: number;
  venc_primeira_parcela: string;
  status: string;
  percem_pago: Number;
}

export class AcordoRespostaModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  acordos: AcordoModel[];
}


// dados necessarios para gera confissão de divida

export class RequisicaoConfissaoDividaModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  id_acordo: string;
  user_login: string;
}

export class ResponseConfissaoDividaModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  base64: string;
}

export class RequisicaoQuebraAcordoModel {
  id_empresa: number;
  id_acordo: string;
  user_login: string;
}

export class ResponseQuebraAcordoModel {
  success: true;
  msg: string;
  id_empresa: number;
  user_login: string;
  id_acordo: string
}
