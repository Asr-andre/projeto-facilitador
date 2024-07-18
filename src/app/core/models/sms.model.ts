export class SmsModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  fone: number;
  mensagem: string;
  user_login: string;
}

export class RetornoSmsEnvio {
id_cliente: number;
msg: string;
success: string;

}
