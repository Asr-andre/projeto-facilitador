// src/app/models/detalhamento.model.ts

export class Prestacao {
  prestacao: number;
  plano: string;
  valor: number;
  juros: number;
  multa: number;
  taxa: number;
  total: number;
}

export class DetalhamentoModel {
  id_cliente: number;
  nome: string;
  cpf: string;
  fantasia: string;
  valor_divida: number;
  telefone: string;
  email: string;
  prestacoes: Prestacao[];
}
