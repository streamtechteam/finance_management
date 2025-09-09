import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataEditMode, Finance, Project, User } from '../../../shared/data.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}

  async dataRequestHandler(mode: DataEditMode) {
    let response: Project | User | Finance | any;
    let token = null;
    if (localStorage.getItem('token') == null) {
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
    console.Object.keys(HttpStatusCode);
    // for (let code in HttpStatusCode) {
    //   if(code)
    // }
    // let test = eval(`HttpStatusCode.${code}`)
    let statusCode = parseInt(code.toFixed());
    if (statusCode >= 200 && statusCode < 300) {
      alertFunc(`Success , Status Code : ${statusCode} and status : ${code}`);
    }
    if (statusCode >= 300 && statusCode < 400) {
      alertFunc(`Need extra action ,Status Code : ${statusCode} and status : ${code}`);
    }
    if (statusCode >= 400 && statusCode < 500) {
      alertFunc(`Client failed , Status Code : ${statusCode} and status : ${code}`);
    }
    if (statusCode >= 500) {
      alertFunc(`Server failed , Status Code : ${statusCode} and status : ${code}`);
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
