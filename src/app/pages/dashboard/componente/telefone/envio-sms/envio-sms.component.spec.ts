import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioSmsComponent } from './envio-sms.component';

describe('EnvioSmsComponent', () => {
  let component: EnvioSmsComponent;
  let fixture: ComponentFixture<EnvioSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioSmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvioSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
