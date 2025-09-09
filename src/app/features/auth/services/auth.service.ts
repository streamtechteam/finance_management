import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import  '../../../core/network.config';
import { VERIFYLOGINPATH } from '../../../network.config';
import { FormDataType, LoginResponse } from '../../../shared/data.types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
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
    // fetch(VERIFYLOGINPATH, {
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

  // async verifyToken(tk?: string) {
  //   let token;
  //   let ifTokenExist: boolean = false;

  //   if (tk) {
  //     token = tk;
  //   } else if (localStorage.getItem('token')) {
  //     token = localStorage.getItem('token');
  //   } else {
  //     return 'no token';
  //   }

  //   await fetch(this.verifyTokenPath, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ token: token }),
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       return res.json();
  //     })
  //     .then((res) => {
  //       // console.log(res);
  //       if (res.status == 200) {
  //         ifTokenExist = true;
  //       } else if (res.status == 401) {
  //         console.log('NO TOKEN ', res.status);
  //         ifTokenExist = false;
  //       }
  //       console.log(res);
  //     })
  //     .then(() => {
  //       if (ifTokenExist == false) {
  //         localStorage.removeItem('token');
  //       }
  //     });

  //   return ifTokenExist;
  // }

  loginDone() {
    this.router.navigate(['/dashboard']);
    alert('Login Successful');
    console.log('login done');
  }
}
