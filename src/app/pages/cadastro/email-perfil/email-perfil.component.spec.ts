import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPerfilComponent } from './email-perfil.component';

describe('EmailPerfilComponent', () => {
  let component: EmailPerfilComponent;
  let fixture: ComponentFixture<EmailPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailPerfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
