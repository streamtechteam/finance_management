import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'RootHomeComponent',
  imports: [RouterOutlet],
  templateUrl: './root-home.component.html',
  styleUrl: './root-home.component.css',
})
export class RootHomeComponent {}
