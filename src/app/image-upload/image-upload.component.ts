import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'], // Or .scss
  imports: [FormsModule, MatButtonModule, MatIconModule],
})
export class ImageUploadComponent {
  @Output() onUploadComplete = new EventEmitter<{
    data: string;
    mimeType: string;
  }>();

  notificationService = inject(NotificationService);
  selectedFile: File | null = null;

  async onFileSelected(event: Event): Promise<void> {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      console.log(this.selectedFile);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          this.onUploadComplete.emit({
            data: reader.result as string,
            mimeType: this.selectedFile?.type ?? 'image/png',
          });
          console.log('data emited', reader.result, this.onUploadComplete);
        };
        reader.readAsDataURL(this.selectedFile);
        this.notificationService.showSuccess('Filled proccessed ');
      } catch (error) {
        this.notificationService.showError('Error reading file');
      }
    } else {
      this.selectedFile = null;
    }
  }
}
