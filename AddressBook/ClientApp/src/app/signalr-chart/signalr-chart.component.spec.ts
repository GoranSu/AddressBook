import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalrChartComponent } from './signalr-chart.component';

describe('SignalrChartComponent', () => {
  let component: SignalrChartComponent;
  let fixture: ComponentFixture<SignalrChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalrChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalrChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
