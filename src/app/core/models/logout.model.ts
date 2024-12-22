export class LogoutModel {
  id_empresa: number;
  user_login: string;
  data_logout: string;
}

export class Retorno {
  success: string;
  msg: string;
  user_login: string;
}
