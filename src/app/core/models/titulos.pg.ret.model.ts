export class TitulosPgRetRequestModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  user_login: string;
}

export class TituloModel {
  id_titulo: number;
  numero_contrato: string;
  vencimento: string;
  pagamento: string;
  id_recibo: number;
  tipo_baixa: string;
  valor: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  desc_principal: number;
  desc_multa: number;
  desc_juros: number;
  desc_taxa: number;
  valor_pago: number;
  user_baixa: string;
}

export class TitulosPgRetResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  titulos: TituloModel[];
}
