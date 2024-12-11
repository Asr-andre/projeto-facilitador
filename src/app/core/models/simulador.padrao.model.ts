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


/* mode para recalcular*/
export class RecalculoRequisicaoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  desconto_principal: number;
  desconto_multa: number;
  desconto_juros: number;
  desconto_taxa: number;
  data_atualizacao: string;
  titulos: string;
  user_login: string;
}

export class TituloRecalculoModel {
  id_titulo: number;
  vencimento: string;
  valor: number;
  desc_principal: number;
  valor_multa: number;
  desc_multa: number;
  valor_juros: number;
  desc_juros: number;
  valor_taxa: number;
  desc_taxa: number;
  valor_atualizado: number;
  atraso: number;
}

export class RecalculoRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  desconto_principal: string;
  desconto_multa: string;
  desconto_juros: string;
  desconto_taxa: string;
  titulos: TituloRecalculoModel[];
}


// baixar de pagamentos
export class TitulosPagoModel {
  id_titulo: number;
  valor: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  valor_atualizado: number;
}

export class BaixaPagamentoRequisicaoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  id_acordo: string;
  data_negociacao: string;
  tipo_baixa: string;
  user_login: string;
  titulos: TitulosPagoModel[];
}


export class BaixaPagamentoRetorno {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
}

// fim do metodos de baixar pagamento
