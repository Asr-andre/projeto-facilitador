import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [Page404Component, Page500Component],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule
  ]
})
export class ExtrapagesModule { }
