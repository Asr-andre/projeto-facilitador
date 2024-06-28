export class AcionamentoModel {
  data: string;
  hora: string;
  operador: string;
  ocorrencia: string;
  historico: string;
  fone: string;
}

export class ClienteModel {
  id_cliente: number;
  acionamentos: AcionamentoModel[];
}
