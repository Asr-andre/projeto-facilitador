import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UiModule } from '../../shared/ui/ui.module';

import {
  NgbAlertModule, NgbCarouselModule, NgbDropdownModule, NgbModalModule, NgbProgressbarModule,
  NgbTooltipModule, NgbPopoverModule, NgbPaginationModule, NgbNavModule, NgbAccordionModule,
  NgbCollapseModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from 'ngx-slider-v2';

import { UiRoutingModule } from './ui-routing.module';
import { AlertsComponent } from './alerts/alerts.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './cards/cards.component';
import { CarouselComponent } from './carousel/carousel.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { GridComponent } from './grid/grid.component';
import { ImagesComponent } from './images/images.component';
import { ModalsComponent } from './modals/modals.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { TypographyComponent } from './typography/typography.component';
import { GeneralComponent } from './general/general.component';
import { VideoComponent } from './video/video.component';
import { TabsComponent } from './tabs/tabs.component';
import { SweetalertComponent } from './sweetalert/sweetalert.component';
import { RangesliderComponent } from './rangeslider/rangeslider.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [AlertsComponent, ButtonsComponent, CardsComponent, CarouselComponent, DropdownsComponent, GridComponent, ImagesComponent, ModalsComponent, ProgressbarComponent, TypographyComponent, GeneralComponent, VideoComponent, TabsComponent, SweetalertComponent, RangesliderComponent],
  imports: [
    CommonModule,
    UiRoutingModule,
    FormsModule,
    NgxSliderModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    UiModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class UIModule { }
