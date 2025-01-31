import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTelefoneComponent } from './modal-telefone.component';

describe('ModalTelefoneComponent', () => {
  let component: ModalTelefoneComponent;
  let fixture: ComponentFixture<ModalTelefoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTelefoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTelefoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
