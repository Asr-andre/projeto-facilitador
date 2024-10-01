export class EmailContaRequestModel {
  id_empresa: number;
  id_perfilemail: number;
}

export class EmailContaModel {
  id_perfilemail: number;
  nome_remetente: string;
  email: string;
  porta: number;
  smtp_host: string;
  smtp_usuario: string;
  smtp_senha: string;
  email_retorno: string;
  email_envio: string;
  gera_acionamento: string;
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

// classes relacioanda ao cadastro dos parametros de smtp
export class EmailContaCadastroModel {
  id_empresa: number;
  id_perfilemail?: number;
  nome_remetente: string;
  email: string;
  porta: number;
  smtp_host: string;
  smtp_usuario: string;
  smtp_senha: string;
  email_retorno: string;
  email_envio: string;
  gera_acionamento: string;
  ssl: string;
  tls: string;
  user_login: string;
}

export class RetornoEmailContaModel {
  success: string;
  msg: string;
  id_empresa: number;
}

export class RetornoEditarModel {
  success: string;
  msg: string;
  id_empresa: number;
  id_perfilemail: number;
}

