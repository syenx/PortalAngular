import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingPapelComponent } from './tracking-papel.component';

describe('TrackingPapelComponent', () => {
  let component: TrackingPapelComponent;
  let fixture: ComponentFixture<TrackingPapelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingPapelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingPapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
