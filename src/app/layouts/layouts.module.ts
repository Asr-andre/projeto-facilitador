import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { VerticalComponent } from './vertical/vertical.component';
import { LayoutComponent } from './layout/layout.component';
import { ChatFlutuanteComponent } from './shared/chat-flutuante/chat-flutuante.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [VerticalComponent,  LayoutComponent, ChatFlutuanteComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    NgbTooltipModule,
  ],
  exports: [VerticalComponent,  ChatFlutuanteComponent]
})
export class LayoutsModule { }
