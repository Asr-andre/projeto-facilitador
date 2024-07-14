export class UsuarioModel {
  id_usuario: number;
  id_empresa: number;
  sigla: string;
  ativo: string;
  login: string;
  nome: string;
  cpf: string;
  email: string;
  tipo: string;
  fone: string;
  senha:string;
  ultimo_acesso: string;
  data_cadastro: string;
  data_alteracao: string;
  user_login: string;
}

export class UsuariosRetornoModel {
  success: string;
  msg: string;
  id_empresa: number;
  contratantes: UsuarioModel[];
}
