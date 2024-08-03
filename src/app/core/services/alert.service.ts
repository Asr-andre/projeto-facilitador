import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private timerInterval: any;

  constructor() {}

  success(message: string, title: string = 'Sucesso!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: true,
      timer: undefined,
      timerProgressBar: false
    });
  }

  error(message: string, title: string = 'Erro!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: undefined,
      timerProgressBar: false
    });
  }

  warning(message: string, title: string = 'Atenção!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      timer: undefined,
      timerProgressBar: false
    });
  }

  timer(show: boolean, timer: number = 2000) {
    if (show) {
      Swal.fire({
        timer: timer,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          this.timerInterval = setInterval(() => {
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const strongElement = htmlContainer.querySelector('strong');
              if (strongElement) {
                strongElement.textContent = Swal.getTimerLeft() + '';
              }
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(this.timerInterval);
        },
        customClass: {
          timerProgressBar: 'custom-timer'
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
      });
    } else {
      Swal.close();
      clearInterval(this.timerInterval);
    }
  }
}
