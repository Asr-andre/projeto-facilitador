export class RequisicaoAcaoCobrancaModel {
  id_empresa: number;
}

export class AcaoCobrancaModel {
  id_acao: number;
  descricao: string;
  data_prox_acio: string;
}

export class RespostaAcaoCobrancaModel {
  success: string;
  msg: string;
  id_empresa: string;
  contratantes: AcaoCobrancaModel[];
}

