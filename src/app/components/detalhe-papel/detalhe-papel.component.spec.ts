import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhePapelComponent } from './detalhe-papel.component';

describe('DetalhePapelComponent', () => {
  let component: DetalhePapelComponent;
  let fixture: ComponentFixture<DetalhePapelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhePapelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhePapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
