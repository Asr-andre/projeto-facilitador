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

export class RequisicaoPefilSms {
  id_empresa: number;
  id_perfilsms: number;
  user_login: string;
  }

  export class PerfilSms {
    id_perfilsms?: number;
    id_empresa: number;
    ativo: string;
    titulo: string;
    empresa: string;
    host: string;
    usuario: string | null;
    senha: string | null;
    sigla: string;
    mensagem: string;
    gera_acionamento: string;
    user_login: string;
  }

  export class PerfilSmsResponse {
    success: string;
    msg: string;
    id_empresa: string;
    perfil_sms: PerfilSms[];
  }

