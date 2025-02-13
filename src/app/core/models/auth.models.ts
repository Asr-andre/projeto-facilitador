export class AuthModel {
  sigla: string;
  login: string;
  senha: string;
}

export class AuthResponse {
  success: string;
  msg: string;
  id_usuario: string;
  id_empresa: string;
  token: string;
}
