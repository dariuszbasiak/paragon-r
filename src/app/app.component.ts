import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MenuComponent,
    MatIconModule,
    LoadingBarComponent,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ParagonR';
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
