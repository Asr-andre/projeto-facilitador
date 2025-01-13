export class RequisicaoAcionamentoModel {
  id_empresa: number;
  id_contratante: number;
  id_usuario?: number;
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

export class RetornoModel {
  success: string;
  msg: string;
  id_empresa: number;
  id_contratante: number;
  dados: AcionamentoAnaliticoModel[];
}

export class AcionamentoAnaliticoModel {
  contratante: string;
  cliente: string;
  usuario: string;
  data_acio: string;
  data_prox_acio: string;
  acao: string;
  mensagem: string;
}
