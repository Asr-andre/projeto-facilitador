import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFlutuanteComponent } from './chat-flutuante.component';

describe('ChatFlutuanteComponent', () => {
  let component: ChatFlutuanteComponent;
  let fixture: ComponentFixture<ChatFlutuanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFlutuanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatFlutuanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
