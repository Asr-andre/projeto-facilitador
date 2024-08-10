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
  id_usuario: number;
  qtde_registros: number;
  resta_registro: number;
}

export class FilaRetornoModel {
  success: string;
  msg: string;
  filas: FilaModel[]
}


export interface FilaAtualizadaResponse {
  success: string;
  msg: string;
  id_empresa: string;
  id_fila: string;
}
