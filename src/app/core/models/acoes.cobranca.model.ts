export class RequisicaoAcaoCobrancaModel {
  id_empresa: number;
  id_contratante: number;
}


export class AcaoCobrancaModel {
  id_acao: number;
  descricao: string;
}

export class RespostaAcaoCobrancaModel {
  success: string;
  msg: string;
  id_empresa: string;
  contratantes: AcaoCobrancaModel[];
}

