export class FilaRequisicaoModel {
  id_empresa: number;
  user_login: string;
}

export class FilaModel {
  id_fila: number;
  id_empresa: number;
  id_contratante: number;
  data: Date;
  descricao: string;
  situacao: string;
  qtde_registros: number;
  resta_registro: number;
}

export class FilaRetornoModel {
  success: string;
  msg: string;
  filas: FilaModel[]
}
