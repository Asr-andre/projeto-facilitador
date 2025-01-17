import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthenticationService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    console.log("servido para desloge chamado")
    // Aqui você pode chamar o serviço de logout para limpar a sessão no banco de dados
    this.authService.sair().subscribe(
      () => console.log('Usuário deslogado da sessão no banco de dados'),
      (error) => console.error('Erro ao deslogar usuário no banco de dados', error)
    );
  }
}
