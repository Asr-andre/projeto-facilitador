import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteContratanteComponent } from './cliente-contratante.component';

describe('ClienteContratanteComponent', () => {
  let component: ClienteContratanteComponent;
  let fixture: ComponentFixture<ClienteContratanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteContratanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteContratanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
