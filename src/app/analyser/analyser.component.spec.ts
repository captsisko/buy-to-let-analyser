import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyserComponent } from './analyser.component';

describe('AnalyserComponent', () => {
  let component: AnalyserComponent;
  let fixture: ComponentFixture<AnalyserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
