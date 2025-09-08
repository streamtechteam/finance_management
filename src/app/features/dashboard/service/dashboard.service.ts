import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataEditMode } from '../../../core/data.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}

  async editData(mode: DataEditMode) {
    let response: object = {};
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
          this.httpClient.post(`http://localhost:3001/api/${mode.data.type}`, mode.data)
        );
        break;
      case 'edit':
        response = await firstValueFrom(
          this.httpClient.put(
            `http://localhost:3001/api/${mode.data.type}/${mode.data.id}`,
            mode.data
          )
        );
        break;
      case 'delete':
        response = await firstValueFrom(
          this.httpClient.delete(`http://localhost:3001/api/${mode.data.type}/${mode.data.id}`)
        );
        break;
      case 'get':
        response = await firstValueFrom(
          this.httpClient.get(`http://localhost:3001/api/${mode.type}`)
        );
        break;
    }
    return response;
  }

  checkIfTokenExist() {
    return localStorage.getItem('token') != null;
    // this.editData()
  }

  async checkIfTokenIsValid() {
    return;
  }
}
