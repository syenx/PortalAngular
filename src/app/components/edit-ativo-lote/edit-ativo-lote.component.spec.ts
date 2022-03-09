import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAtivoLoteComponent } from './edit-ativo-lote.component';

describe('EditAtivoLoteComponent', () => {
  let component: EditAtivoLoteComponent;
  let fixture: ComponentFixture<EditAtivoLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAtivoLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAtivoLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
