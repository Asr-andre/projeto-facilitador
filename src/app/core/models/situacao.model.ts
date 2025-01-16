export class RequisicaoSituacaoModel {
  user_login: string;
}

export class RetornoSituacaoModel {
  success: string;
  msg: string;
  dados: SituacaoModel[];
}

export class SituacaoModel {
  id_situacao: number;
  descricao: string;
  data_cadastro: string;
  data_alteracao: string;
  user_login: string;
}
