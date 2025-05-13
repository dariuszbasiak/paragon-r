import { Component, OnInit, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent implements OnInit {
  isLoading: boolean = false;
  loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loadingService.loadingState$.subscribe((state) => {
      this.isLoading = state;
    });
  }
}
