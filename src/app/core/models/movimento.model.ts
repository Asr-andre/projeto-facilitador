export class MovimentosRequestModel {
  id_empresa: number;
  user_login: string;
}

export class MovimentosResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  dados: string[];
}
