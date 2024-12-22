export class LogsModel {
  id_empresa: number;
  data_inicio: string;
  data_fim: string;
  user_login: string;
}

export class Log {
  idlog: number;
  data: string;
  acao: string;
  descricao: string;
  user_login: string;
  user_ip: string;
}

export class LogsResponse {
  success: string;
  msg: string;
  id_empresa: string;
  logs: Log[];
}
