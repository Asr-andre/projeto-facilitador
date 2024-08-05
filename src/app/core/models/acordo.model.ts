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
}

export class AcordoRespostaModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  acordos: AcordoModel[];
}
