import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ClipboardService } from './copia.para.transferencia.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private timerInterval: any;

  constructor(
    private _copia: ClipboardService
  ) { }

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-sm me-1',
      cancelButton: 'btn btn-danger btn-sm ml-2',
      title: 'text-center', // Opcional, para centralizar o título
      popup: 'custom-alert-size', // Classe ultilizada para configurar o modal baseado no css
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

  info(message: string, title: string = 'Info!') {
    this.swalWithBootstrapButtons.fire({
      title: title,
      text: message,
      icon: 'info',
      showConfirmButton: true
    });
  }

  warningCustome(message: string, title: string = 'Atenção!'): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: title,
      html: message,
      icon: 'warning',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  question(message: string, title: string = 'Tem certesa que deseja proceguir com a ação?') {
    this.swalWithBootstrapButtons.fire({
      title: title,
      text: message,
      icon: 'question',
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
        this.swalWithBootstrapButtons.fire('Exclusão em execução, aguarde!');
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false;
    });
  }

  quebra(): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: 'Você deseja quebra o acordo selecionado?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.swalWithBootstrapButtons.fire('Quebra em execução, aguarde!');
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false;
    });
  }

  cancelarRecibo(): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: 'Você deseja cancelar o recibo selecionado?',
      icon: 'warning',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.swalWithBootstrapButtons.fire('Cancelamento em execução, aguarde!');
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
        this.swalWithBootstrapButtons.fire('Baixa em execução, aguarde!');
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false;
    });
  }

  copiado(): Promise<boolean> {
    this.swalWithBootstrapButtons.fire({
      title: 'Copiado para a área de transferência!',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    // Retorna uma Promise que resolve após 4 segundos
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  impressaoDocumento(): Promise<boolean> {
    this.swalWithBootstrapButtons.fire({
      title: 'Aguarde, o documento está sendo gerado...',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    // Retorna uma Promise que resolve após 4 segundos
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  infoComLinks(message: string, links: { texto: string, url: string, icon: string }[], title: string = 'Boleto gerado com sucesso!') {
    const linksHtml = links.map(link => `
        <div class="btn btn-light d-flex align-items-center justify-content-between p-2 rounded shadow-sm mb-2 w-100 link-container"
             style="cursor: pointer;" data-url="${link.url}">
            <div class="d-flex align-items-center">
                <i class="${link.icon} me-2"></i> ${link.texto}
            </div>
            <i class="fas fa-clone text-primary copiar-link" data-copy="${link.url}" style="cursor: pointer;"></i>
        </div>
    `).join('');

    this.swalWithBootstrapButtons.fire({
      title: `<h3 class="fw-bold">${title}</h3>`,
      html: `<p class="fs-5 mb-3">${message}</p>${linksHtml}`,
      width: '400px',
      showConfirmButton: true,
      confirmButtonText: 'Fechar',
      customClass: {
        popup: 'p-2',
        confirmButton: 'btn btn-secondary btn-sm'
      },
      didOpen: () => {
        // Adiciona evento para abrir o link ao clicar na div
        document.querySelectorAll('.link-container').forEach((container: any) => {
          container.addEventListener('click', () => {
            const url = container.getAttribute('data-url');
            window.open(url, '_blank');
          });
        });

        // Adiciona evento para copiar sem fechar o alert
        document.querySelectorAll('.copiar-link').forEach((icon: any) => {
          icon.addEventListener('click', (event: Event) => {
            event.stopPropagation(); // Evita que o clique ative o link principal
            const url = icon.getAttribute('data-copy');
            const feedback = icon.nextElementSibling as HTMLElement;

            // Chamar o serviço para copiar
            this._copia.copyToClipboard(url!)
          });
        });
      }
    });
  }
}
