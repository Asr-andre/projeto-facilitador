import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private timerInterval: any;

  constructor() {}

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-sm me-1',
      cancelButton: 'btn btn-danger btn-sm ml-2',
      title: 'text-center'  // Opcional, para centralizar o título
    },
    buttonsStyling: false
  });

  success(message: string, title: string = 'Sucesso!') {
    this.swalWithBootstrapButtons.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: true
    });
  }

  error(message: string, title: string = 'Erro!') {
    this.swalWithBootstrapButtons.fire({
      title: title,
      text: message,
      icon: 'error',
      showConfirmButton: true
    });
  }

  warning(message: string, title: string = 'Atenção!') {
    this.swalWithBootstrapButtons.fire({
      title: title,
      text: message,
      icon: 'warning',
      showConfirmButton: true
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

  retirada(): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: 'Você deseja retirar todos os titulos selecionados?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.swalWithBootstrapButtons.fire('Titulos retirados com sucesso!');
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false;
    });
  }

  baixarPg(): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: 'Você deseja baixar todos os titulos selecionados?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.swalWithBootstrapButtons.fire('Baixa efetuada com sucesso!');
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false;
    });
  }
}
