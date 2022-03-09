import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaAtivoComponent } from './busca-ativo.component';

describe('BuscaAtivoComponent', () => {
  let component: BuscaAtivoComponent;
  let fixture: ComponentFixture<BuscaAtivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscaAtivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaAtivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
