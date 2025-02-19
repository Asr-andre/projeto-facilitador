export class Titulo {
  id_titulo: number;
  numero_contrato: string;
  data_vencimento: string;
  valor: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  valor_atualizado: number;
  atraso: number;
  desc_principal: number;
  desc_multa: number;
  desc_juros: number;
  desc_taxa: number;
}

export class GerarPixRequest {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  id_usuario: number;
  user_login: string;
  data_vencimento: string;
  valor_boleto: number;
  servico: string;
  titulos: Titulo[];
}

export class GerarPixResponse {
  success: string;
  msg: string;
  id_cliente: string;
  id_boleto: string;
  valor: string;
  vencimento: string;
  pixCopiaECola: string;
  urlImagemQrCode: string;
}
