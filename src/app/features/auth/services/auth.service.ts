import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import  '../../../core/network.config';
import { VERIFYLOGINPATH } from '../../../network.config';
import { FormDataType, LoginResponse } from '../../../shared/data.types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialAlertService } from '../../alert/service/alert.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private materialAlert: MaterialAlertService,
  ) {}

  verifyLogin(formData: FormDataType) {
    // console.log('formData', JSON.stringify(formData));
    let formDataServer : {
      phone: string;
      password: string;
    } = {
      phone: formData.phonenumber,
      password: formData.password,
    };
    firstValueFrom(this.httpClient.post<LoginResponse>(VERIFYLOGINPATH, formDataServer)).then(
      (res: LoginResponse) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem('token', res.token);
          this.loginDone();
          return res;
        } else {
          alert('check you username and password');
          return res;
        }
      },
    ).catch((err: HttpErrorResponse) => {
      let errorMessage = err.error.message;
      console.log(err);
      if (err.message.includes('401')) {
        errorMessage = 'Check your username and password';
      }
      this.materialAlert.error('Login Failed' ,errorMessage).subscribe((res) => {
        
        console.log(res);
        if (res.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    });
  }

  loginDone() {
    this.materialAlert.success('Login Successful' , 'Login Successful').subscribe((res) => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
