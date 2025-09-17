import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityManagementComponent as UserManagement } from './entity-management.component';

describe('UserManagement', () => {
  let component: UserManagement;
  let fixture: ComponentFixture<UserManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
