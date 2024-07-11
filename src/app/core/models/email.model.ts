export class CadastrarEmailModel {
  id_cliente: number;
  email: string;
  situacao: string;
  origem: string;
  ativo: string;
  user_login: string;
}

export class EmailModel {
  email: string;
  situacao: string;
  origem: string;
  ativo: string;
  data_cadastro: string;
  user_login: string;
}

export class EmailRetornoModel {
  success: string;
  msg: string;
  id_cliente: string;
  emails: EmailModel[];
}

