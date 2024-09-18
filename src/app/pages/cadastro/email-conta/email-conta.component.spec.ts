import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailContaComponent } from './email-conta.component';

describe('EmailContaComponent', () => {
  let component: EmailContaComponent;
  let fixture: ComponentFixture<EmailContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailContaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
