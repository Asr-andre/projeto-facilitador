import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsWhatsappComponent } from './sms-whatsapp.component';

describe('SmsWhatsappComponent', () => {
  let component: SmsWhatsappComponent;
  let fixture: ComponentFixture<SmsWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsWhatsappComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
