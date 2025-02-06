export class RequisicaoBancos {
  id_empresa: number;
  user_login: string;
}

export class RetornoBanco {
  success: string;
  msg: string;
  bancos: Bancos[];
}

export class Bancos {
  id_banco: number;
  descricao: string;
}
