import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { DataEditMode, DialogData, Finance, Project, User } from '../../../shared/data.types';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertResult } from '../../alert/service/alert.service';
import { AlertConfig } from '../../../shared/alert.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  isDialogOpen = signal<DialogData>({
    hidden : true,
    title: '',
    items: []
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

 public openDialog(config: AlertConfig): Observable<AlertResult> {
    return this.dialog
      .open(DialogComponent, {
        data: config,
        width: '400px',
        maxWidth: '95vw',
        disableClose: false,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        map((result) => {
          // If user clicks confirm → result = input value (or true if no input)
          // If user cancels or closes → result = false
          if (result === undefined || result === false) {
            return { isConfirmed: false };
          }
          return {
            isConfirmed: true,
            value: typeof result === 'string' ? result : null,
          };
        })
      );
  }


  async dataRequestHandler(mode: DataEditMode) {
    let response: Project | User | Finance | any;
    let title;
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
        title = mode.data.type;
        break;
      case 'delete':
        response = await firstValueFrom(
          this.httpClient.delete(`http://localhost:3001/api/${mode.data.type}/${mode.data.id}`),
        );
        title = mode.data.type;
        break;
      case 'get':
        response = await firstValueFrom(
          this.httpClient.get(`http://localhost:3001/api/${mode.type}`),
        );
        title = mode.type;
        break;
    }
    return {
      responese : response,
      title : title

    }
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
