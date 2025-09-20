import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'RootDashboardComponent',
  imports: [RouterOutlet, SidebarComponent, MatToolbar, MatIcon, MatIconButton],
  templateUrl: './root-dashboard.component.html',
  styleUrl: './root-dashboard.component.css',
})
export class RootDashboardComponent {}
