export class RequisicaoNotificacao {
  sigla: string;
  user_login: string;
}

export class RetornoNotificacao {
  success: string;
  msg: string;
  sigla: string;
  dados: Dados[];
}

export class Dados {
  id: number;
  sigla: string;
  descricao: string;
  enabled_payment_received: boolean;
  emailenabledprovider_payment_received: boolean;
  smsenabledprovider_payment_received: boolean;
  emailenabledcustomer_payment_received: boolean;
  smsenabledcustomer_payment_received: boolean;
  phonecallenabledcustomer_payment_received: boolean;
  whatsappenabledcustomer_payment_received: boolean;
  enabled_payment_overdue: boolean;
  emailenabledprovider_payment_overdue: boolean;
  smsenabledprovider_payment_overdue: boolean;
  emailenabledcustomer_payment_overdue: boolean;
  smsenabledcustomer_payment_overdue: boolean;
  phonecallenabledcustomer_payment_overdue: boolean;
  whatsappenabledcustomer_payment_overdue: boolean;
  enabled_payment_duedate_warning: boolean;
  emailenabledprovider_payment_duedate_warning: boolean;
  smsenabledprovider_payment_duedate_warning: boolean;
  emailenabledcustomer_payment_duedate_warning: boolean;
  smsenabledcustomer_payment_duedate_warning: boolean;
  phonecallenabledcustomer_payment_duedate_warning: boolean;
  whatsappenabledcustomer_payment_duedate_warning: boolean;
  scheduleoffset_payment_duedate_warning: number;
  enabled_payment_duedate_warning_2: boolean;
  emailenabledprovider_payment_duedate_warning_2: boolean;
  smsenabledprovider_payment_duedate_warning_2: boolean;
  emailenabledcustomer_payment_duedate_warning_2: boolean;
  smsenabledcustomer_payment_duedate_warning_2: boolean;
  phonecallenabledcustomer_payment_duedate_warning_2: boolean;
  whatsappenabledcustomer_payment_duedate_warning_2: boolean;
  enabled_payment_created: boolean;
  emailenabledprovider_payment_created: boolean;
  smsenabledprovider_payment_created: boolean;
  emailenabledcustomer_payment_created: boolean;
  smsenabledcustomer_payment_created: boolean;
  phonecallenabledcustomer_payment_created: boolean;
  whatsappenabledcustomer_payment_created: boolean;
  enabled_payment_updated: boolean;
  emailenabledprovider_payment_updated: boolean;
  smsenabledprovider_payment_updated: boolean;
  emailenabledcustomer_payment_updated: boolean;
  smsenabledcustomer_payment_updated: boolean;
  phonecallenabledcustomer_payment_updated: boolean;
  whatsappenabledcustomer_payment_updated: boolean;
  enabled_send_linha_digitavel: boolean;
  emailenabledprovider_send_linha_digitavel: boolean;
  smsenabledprovider_send_linha_digitavel: boolean;
  emailenabledcustomer_send_linha_digitavel: boolean;
  smsenabledcustomer_send_linha_digitavel: boolean;
  phonecallenabledcustomer_send_linha_digitavel: boolean;
  whatsappenabledcustomer_send_linha_digitavel: boolean;
  enabled_payment_overdue_2: boolean;
  emailenabledprovider_payment_overdue_2: boolean;
  smsenabledprovider_payment_overdue_2: boolean;
  emailenabledcustomer_payment_overdue_2: boolean;
  smsenabledcustomer_payment_overdue_2: boolean;
  phonecallenabledcustomer_payment_overdue_2: boolean;
  whatsappenabledcustomer_payment_overdue_2: boolean;
  scheduleoffset_payment_overdue_2: number;
}
