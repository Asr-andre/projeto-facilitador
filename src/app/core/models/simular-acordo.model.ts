export class SimulacaoRequisicaoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  data_acordo: string;
  valor_acordo: number;
  qtde_parcelas: number;
  periodicidade: string;
  valor_entrada: number;
  vencimento: string;
  user_login: string;
}

export class TituloSimulacao {
  vencimento: string;
  valor: number;
  parcela: number;
  plano: number;
}

export class SimulacaoRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratante: string;
  id_cliente: string;
  titulos: TituloSimulacao[];
}
