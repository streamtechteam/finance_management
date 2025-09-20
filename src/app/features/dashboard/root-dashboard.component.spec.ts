import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootDashboard } from './root-dashboard';

describe('RootDashboard', () => {
  let component: RootDashboard;
  let fixture: ComponentFixture<RootDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
