import { Component, inject, OnInit } from '@angular/core';
import { WebCameraComponent } from '../web-camera/web-camera.component';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Receipt } from '../models/receipt.interface';
import { LoadingService } from '../services/loading.service';
import { ModelService } from '../services/model.service';
import { NotificationService } from '../services/notification.service';
import { ParagonFormComponent } from '../paragon-form/paragon-form.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-receipt',
  imports: [
    WebCameraComponent,
    ImageUploadComponent,
    ParagonFormComponent,
    WebCameraComponent,
  ],
  templateUrl: './add-receipt.component.html',
  styleUrl: './add-receipt.component.scss',
})
export class AddReceiptComponent implements OnInit {
  modelService = inject(ModelService);
  loadingService = inject(LoadingService);
  notificationService = inject(NotificationService);
  titleService = inject(Title);
  title = 'ParagonR - Add Recipe';

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  base64image: string | null = null;
  uploadResponse: Receipt | null = null;

  async updateImage(event: { data: string; mimeType: string }) {
    this.base64image = event.data;
    const data = await this.modelService.sendMessage(
      event.data,
      event.mimeType
    );
    this.uploadResponse = data;
  }
}
