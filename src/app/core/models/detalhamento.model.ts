export class Prestacao {
  public parcela: number;
  public plano: number;
  public id_titulo: number;
  public numero_contrato: string;
  public vencimento: Date;
  public produto: string;
  public atraso: number;
  public valor: number;
  public valor_juros: number | null;
  public valor_multa: number | null;
  public valor_taxa: number | null;
  public saldo_devedor: number;
  public selecionado?: boolean;
}

export class DetalhamentoModel {
  public success: boolean;
  public msg: string;
  public credor: string;
  public nome: string;
  public cpf: string;
  public fone: string;
  public email: string;
  public parcelas: Prestacao[];
}
