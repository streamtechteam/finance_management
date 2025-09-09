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

@Component({
  standalone: true,
  selector: 'LoginComponent',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      numberInputField: ['', [Validators.required]],
      passwordInputField: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
      ],
    });
    // this.authService
  }
  // this.verifyToken().then((res) => {
  //   if (typeof res === 'boolean' && res) {
  //     this.loginDone();
  //   }
  // });
  // }

  get numberCtrl() {
    return this.loginForm.get('numberInputField');
  }
  get passwordCtrl() {
    return this.loginForm.get('passwordInputField');
  }
  getLoginInput() {
    // event.preventDefault();

    let formData: FormDataType = this.loginForm.getRawValue();
    console.log('formData', formData);
    localStorage.removeItem('token');
    this.authService.verifyLogin(formData);
  }
}
