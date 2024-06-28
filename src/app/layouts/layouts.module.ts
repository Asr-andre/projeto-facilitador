import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [VerticalComponent, HorizontalComponent, LayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SimplebarAngularModule
  ],
  exports: [VerticalComponent, HorizontalComponent]
})
export class LayoutsModule { }
