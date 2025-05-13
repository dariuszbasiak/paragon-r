import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  inject,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModelService } from '../services/model.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';

const NO_CAMERA_SUPPORT = 'The browser not support your camera';

@Component({
  selector: 'app-web-camera',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './web-camera.component.html',
  styleUrls: ['./web-camera.component.scss'],
})
export class WebCameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;
  @Output() onUploadComplete = new EventEmitter<{
    data: string;
    mimeType: string;
  }>();

  cdr = inject(ChangeDetectorRef);
  base64image: string | null = null;
  stream: MediaStream | null = null;
  cameraError: string | null = null;
  isCameraReady = false;
  modelService = inject(ModelService);
  loadingService = inject(LoadingService);
  notificationService = inject(NotificationService);
  isImageFreeze = false;

  async ngOnInit() {
    await this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      //@ts-ignore
      if (window?.navigator?.mediaDevices?.getUserMedia) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (this.videoElement?.nativeElement && this.stream) {
          this.videoElement.nativeElement.srcObject = this.stream;

          this.videoElement.nativeElement.onloadedmetadata = () => {
            this.isCameraReady = true;
            this.cameraError = null;
            this.cdr.detectChanges();
          };
        } else {
          this.notificationService.showError(NO_CAMERA_SUPPORT);
          throw new Error('Video element not available.');
        }
      } else {
        this.notificationService.showError(NO_CAMERA_SUPPORT);
        throw new Error('getUserMedia is not supported in this browser.');
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError') {
        this.notificationService.showError(
          'Camera access was denied. Please enable camera permissions in your browser settings.'
        );
      } else if (error.name === 'NotFoundError') {
        this.notificationService.showError(NO_CAMERA_SUPPORT);
      } else {
        this.notificationService.showError(NO_CAMERA_SUPPORT);
      }
      this.isCameraReady = false;
      this.cdr.detectChanges();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isCameraReady = false;
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  cameraButtonHandler() {
    if (!this.isImageFreeze) {
      this.captureImage();
    } else if (this.canvasElement?.nativeElement) {
      const canvas = this.canvasElement?.nativeElement;
      const context = canvas?.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
      this.isImageFreeze = false;
    }
  }
  captureImage() {
    if (
      this.isCameraReady &&
      this.videoElement?.nativeElement &&
      this.canvasElement?.nativeElement
    ) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.isImageFreeze = true;
        this.base64image = canvas.toDataURL('image/png'); // Or 'image/jpeg'

        this.onUploadComplete.emit({
          data: this.base64image,
          mimeType: 'image/png',
        });
      } else {
        console.error('Could not get 2D context from canvas.');
        this.cameraError = 'Failed to process image capture.';
      }
    } else {
      this.cameraError =
        'Camera not ready or elements not available for capture.';
    }
    this.cdr.detectChanges();
  }
}
