export class EmailContaRequestModel {
  id_empresa: number;
  id_Perfilemail: number;
}

export class EmailContaModel {
  id_perfilemail: number;
  email: string;
  porta: number;
  smtp_host: string;
  smtp_usuario: string;
  smtp_senha: string;
  email_retorno: string;
  email_envio: string;
  tipo_email: string;
  ssl: string;
  tls: string;
  data_cadastro: string;
  user_login: string;
}

export class EmailContaResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  perfil: EmailContaModel[];
}
