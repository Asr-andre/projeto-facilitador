import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTitulosComponent } from './cliente-titulos.component';

describe('ClienteTitulosComponent', () => {
  let component: ClienteTitulosComponent;
  let fixture: ComponentFixture<ClienteTitulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTitulosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
