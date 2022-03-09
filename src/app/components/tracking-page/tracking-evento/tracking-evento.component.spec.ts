import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingEventoComponent } from './tracking-evento.component';

describe('TrackingEventoComponent', () => {
  let component: TrackingEventoComponent;
  let fixture: ComponentFixture<TrackingEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
