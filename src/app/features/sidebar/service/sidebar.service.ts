import { Injectable, signal, WritableSignal } from '@angular/core';
import { SidebarItem } from '../../../shared/data.types';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  _menuItems : WritableSignal<SidebarItem[]> = signal<SidebarItem[]>([]);
  get menuItems() {
    console.log(this._menuItems());
    return this._menuItems;
  }

}
