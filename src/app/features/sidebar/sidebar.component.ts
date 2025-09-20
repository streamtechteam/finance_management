import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SidebarService } from './service/sidebar.service';
import { SidebarItem } from '../../shared/data.types';
@Component({
  selector: 'SidebarComponent',
  imports: [MatSidenav, MatToolbar, MatButton, MatIcon, MatNavList, MatListItem, MatIconButton, RouterLink ,MatSidenavContainer,MatSidenavContent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidenavOpen = signal(false);
  
  menuItems : Signal<SidebarItem[]> ;
  constructor(private sidebarService: SidebarService) {
    this.menuItems = computed(() => this.sidebarService.menuItems());
    // this.menuItems.set(this.sidebarService.menuItems());
  }
}
