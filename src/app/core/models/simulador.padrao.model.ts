export class SimulacaoRequisicaoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  user_login: string;
  data_atualizacao: string;
  titulos: string;
}

export class TituloSimulacaoModel {
  id_titulo: number;
  valor: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  valor_atualizado: number;
  vencimento: Date;
  atraso: number;
}

export class SimulacaoRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  desconto_principal: string;
  desconto_multa: string;
  desconto_juros: string;
  desconto_taxa: string;
  titulos: TituloSimulacaoModel[];
}
