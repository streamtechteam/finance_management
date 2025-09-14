import { DatePipe } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'DialogItem',
  imports: [DatePipe , MatIconButton , MatIcon],
  templateUrl: './dialog-item.component.html',
  styleUrl: './dialog-item.component.css'
})
export class DialogItem {
  isActive = true;
  name : InputSignal<string | undefined> = input();
  date : InputSignal<string | undefined | Date> = input();

  id : InputSignal<string | undefined> = input();
}
