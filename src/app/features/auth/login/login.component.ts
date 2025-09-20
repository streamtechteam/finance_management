import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormDataType } from '../../../shared/data.types';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { SidebarService } from '../../sidebar/service/sidebar.service';

@Component({
  standalone: true,
  selector: 'LoginComponent',
  imports: [ReactiveFormsModule, MatButton, MatInput, MatFormField, MatLabel, MatIcon, MatHint, MatSuffix , MatIconButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  showPasswordClick(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      phonenumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    });
  }


  get numberCtrl() {
    return this.loginForm.get('phonenumber');
  }
  get passwordCtrl() {
    return this.loginForm.get('password');
  }
  getLoginInput() {
    // event.preventDefault();
   
    let formData: FormDataType = this.loginForm.getRawValue();
    console.log('formData', formData);
    localStorage.removeItem('token');
    this.authService.verifyLogin(formData);
  }
}
