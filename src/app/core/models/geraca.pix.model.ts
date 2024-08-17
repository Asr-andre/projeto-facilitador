export class TituloPixModel {
  id_titulo: number;
  numero_contrato: string;
  data_vencimento: string;
  valor: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  valor_atualizado: number;
  atraso: number;
}

export class GeracaoPixRequest {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  id_usuario: number;
  user_login: string;
  valor_boleto: number;
  servico: string;
  titulos: TituloPixModel[];
}
