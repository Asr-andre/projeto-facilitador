import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [TopbarComponent, SidebarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SimplebarAngularModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule,
    NgbNavModule
  ],
  exports: [TopbarComponent, SidebarComponent],
  providers: [LanguageService]
})
export class SharedModule { }
