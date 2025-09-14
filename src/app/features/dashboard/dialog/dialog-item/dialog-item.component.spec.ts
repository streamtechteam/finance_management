import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogItem } from './dialog-item.component';

describe('DialogItem', () => {
  let component: DialogItem;
  let fixture: ComponentFixture<DialogItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
