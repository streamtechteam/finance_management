import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import  '../../../core/network.config';
import { VERIFYLOGINPATH } from '../../../network.config';
import { FormDataType, LoginResponse } from '../../../shared/data.types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
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
    let formDataServer = {
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
    );
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: formDataString,
    // })
    //   .then((res) => {
    //     // console.log(res.json())
    //     return res.json();
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (res.status == 200) {
    //       localStorage.setItem('token', res.token);
    //       this.loginDone();
    //       return res;
    //     } else {
    //       alert('check you username and password');
    //     }
    //   });
  }

  loginDone() {
    this.materialAlert.success('Login Successful' , 'Login Successful').subscribe((res) => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(['/dashboard']);
      }
    });
    // Swal.fire({
    //   title: 'Login Successful',
    //   // html: `
    //   // <button class="mat-mdc-button">
    //   // test
    //   // </button>
    //   // `,
      
    //   icon: 'success',
    //   // timer: 1000,
      
    // }).then(() => {
    //   this.router.navigate(['/dashboard']);
    // });

    // alert('Login Successful');
    // console.log('login done');
  }
}
