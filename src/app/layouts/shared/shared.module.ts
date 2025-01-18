import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [TopbarComponent, FooterComponent, SidebarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SimplebarAngularModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule,
    NgbNavModule
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent],
  providers: [LanguageService]
})
export class SharedModule { }
