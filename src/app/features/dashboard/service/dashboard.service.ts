import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataEditMode, Finance, Project, User } from '../../../shared/data.types';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  async dataRequestHandler(mode: DataEditMode) {
    let response: Project | User | Finance | any;
    let token = null;
    if (localStorage.getItem('token') == null) {
      alert('You are not logged in');
      this.router.navigate(['home']);
      //TODO: redirect to login page
      return;
    } else {
      token = localStorage.getItem('token');
    }

    switch (mode.mode) {
      case 'add':
        response = await firstValueFrom(
          this.httpClient.post(`http://localhost:3001/api/${mode.data.type}`, mode.data),
        );
        break;
      case 'edit':
        response = await firstValueFrom(
          this.httpClient.put(
            `http://localhost:3001/api/${mode.data.type}/${mode.data.id}`,
            mode.data,
          ),
        );
        break;
      case 'delete':
        response = await firstValueFrom(
          this.httpClient.delete(`http://localhost:3001/api/${mode.data.type}/${mode.data.id}`),
        );
        break;
      case 'get':
        response = await firstValueFrom(
          this.httpClient.get(`http://localhost:3001/api/${mode.type}`),
        );
        break;
    }
    return response;
  }
  // editData(mode: DataEditMode) {
  //   this.dataRequestHandler(mode).then((res) => {
  //     return res;
  //     // this.statusCodeHandler(res.status, alert);
  //   });
  //   // return
  // }

  statusCodeHandler(code: HttpStatusCode, alertFunc: Function) {
    // friendly advice :
    // dont try to understand this variable , you may lost a lot of brain cells , it just works
    let status = Object.keys(HttpStatusCode).slice(
      Object.keys(HttpStatusCode).length / 2,
      Object.keys(HttpStatusCode).length,
    )[
      Object.keys(HttpStatusCode)
        .slice(0, Object.keys(HttpStatusCode).length / 2)
        .indexOf(code.toString())
    ];

    let statusCode = parseInt(code.toFixed());

    if (statusCode >= 200 && statusCode < 300) {
      alertFunc(`Success , Status Code : ${statusCode} and status : ${status}`);
    }
    if (statusCode >= 300 && statusCode < 400) {
      alertFunc(`Need extra action ,Status Code : ${statusCode} and status : ${status}`);
    }
    if (statusCode >= 400 && statusCode < 500) {
      alertFunc(`Client failed , Status Code : ${statusCode} and status : ${status}`);
    }
    if (statusCode >= 500) {
      alertFunc(`Server failed , Status Code : ${statusCode} and status : ${status}`);
    }
    return {
      status: code,
      code: statusCode,
    };
  }
  checkIfTokenExist() {
    return localStorage.getItem('token') != null;
    // this.editData()
  }

  async checkIfTokenIsValid() {
    return;
  }
}
