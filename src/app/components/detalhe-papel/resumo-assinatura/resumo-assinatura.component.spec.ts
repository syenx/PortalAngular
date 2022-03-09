import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoAssinaturaComponent } from './resumo-assinatura.component';

describe('ResumoAssinaturaComponent', () => {
  let component: ResumoAssinaturaComponent;
  let fixture: ComponentFixture<ResumoAssinaturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoAssinaturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumoAssinaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
