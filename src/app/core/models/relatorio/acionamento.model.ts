export class RequisicaoAcionamentoModel {
  id_empresa: number;
  id_contratante: number;
  data_inicio: string;
  data_fim: string;
  user_login: string;
}

export class RetornoAcionamentoModel {
  success: string;
  msg: string;
  id_empresa: number;
  id_contratante: number;
  dados: AcionamentoModel[];
}

export class AcionamentoModel {
  descricao: string;
  login: string;
  total: number;
}
