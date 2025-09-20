import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootHome } from './root-home';

describe('RootHome', () => {
  let component: RootHome;
  let fixture: ComponentFixture<RootHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
