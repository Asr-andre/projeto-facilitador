import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSituacaoComponent } from './modal-situacao.component';

describe('ModalSituacaoComponent', () => {
  let component: ModalSituacaoComponent;
  let fixture: ComponentFixture<ModalSituacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSituacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSituacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
