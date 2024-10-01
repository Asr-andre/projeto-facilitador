export class SmsWhatsappRequestModel {
  id_empresa: number;
  id_PerfilWhatsapp: number;
  user_login: string;
}

export class PerfilWhatsappModel {
  id_perfilwhatsapp: number;
  ativo: string;
  titulo: string;
  empresa: string;
  host: string;
  usuario: string | null;
  sigla: string;
  centro_custo: string;
  gera_acionamento: string;
}

export class SmsWhatsappResponseModel {
  success: string;
  msg: string;
  id_empresa: number;
  perfil_whatsapp: PerfilWhatsappModel[];
}

export class CadastroMensagemModel {
  id_empresa: number;
  titulo: string;
  empresa: string;
  host: string;
  usuario: string;
  senha: string;
  sigla: string;
  centro_custo: string;
  gera_acionamento: string;
  user_login: string;
  mensagem: string;
  token: string;
}

export class WhatsappResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  id_perfilwhats: string;
}

