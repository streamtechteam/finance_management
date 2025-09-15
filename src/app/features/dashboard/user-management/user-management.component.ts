import { DashboardService } from './../service/dashboard.service';
import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { User } from '../../../shared/data.types';

@Component({
  selector: 'app-user-management',
  imports: [MatButton, MatIcon, MatList, MatCard , MatIconButton , RouterLink],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users : User[] = [];
  constructor(private dashboardService : DashboardService){
    this.dashboardService.dataRequestHandler({mode: 'get', type: 'users'}).then((res) => {
      console.log(res);
      this.users = res?.responese.data;
    });
  }
}
