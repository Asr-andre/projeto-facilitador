export class ImportacaoRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  dados: ImportacaoDetalhesModel[];
}

export class ImportacaoDetalhesModel {
  id_remessa: number;
  id_contratante: number;
  qtde_clientes: number;
  arquivo: string;
  qtde_emails: number;
  qtde_fones: number;
  qtde_titulos: number;
  total_titulos: number;
  data_importacao: string;
  user_login: string;
}

export class ImportacaoRequisicaoModel {
  id_empresa: number;
}
