import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';


@Component({
  selector: 'app-user-edit',
  imports: [MatFormField, MatIcon, MatLabel, MatButton, ReactiveFormsModule, MatInput , MatSuffix] ,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  userForm = new FormGroup({
}
