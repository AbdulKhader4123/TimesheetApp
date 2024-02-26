import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  menuState = false
  toggleMenu(){
    this.menuState = !this.menuState
  }
}
