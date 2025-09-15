import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });


  }

  onSubmit(){
    console.log("test")
  }
}
