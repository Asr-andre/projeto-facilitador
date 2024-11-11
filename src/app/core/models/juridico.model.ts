export class JuridicoRequestModel {
  id_empresa: number;
  user_login: string;
}

export class JuridicoResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  processos: ProcessoModel[];
}

export class ProcessoModel {
  id_processo: number;
  id_empresa: number;
  id_cliente: number;
  numero_processo: string;
  data_entrada_processo: string;
  tipo_acao: string;
  comarca: string;
  vara: string;
  adv_causa: string;
  adv_contrario: string;
  data_audiencia: string;
  ultimo_andamento: string;
  obs: string;
  user_login: string;
  data_cadastro: string;
  data_alteracao: string;
}
