import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Cafe Management System';

  sidebarwidth = signal(300);
  displaySidebr = signal('block');

  displayMember = signal('none')
  carddisplay = signal('none');

  toggleSidebar(){
    if(this.sidebarwidth() == 300){
      this.sidebarwidth.set(60);
      this.displaySidebr.set('none')
    } else {
      this.sidebarwidth.set(300);
      setTimeout(() => this.displaySidebr.set('block'),250);
    }
  }
}
