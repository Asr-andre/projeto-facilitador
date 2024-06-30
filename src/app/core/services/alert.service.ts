import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  success(message: string, title: string = 'Sucesso!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }

  error(message: string, title: string = 'Erro!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }

  warning(message: string, title: string = 'Atenção!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }
}
