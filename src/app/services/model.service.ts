import { inject, Inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  getVertexAI,
  getGenerativeModel,
  GenerativeModel,
} from '@angular/fire/vertexai';
import { Receipt } from '../models/receipt.interface';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';
@Injectable({
  providedIn: 'root',
})
export class ModelService {
  modelId = 'gemini-2.0-flash';
  loadingService = inject(LoadingService);
  notificationService = inject(NotificationService);
  model: GenerativeModel | null = null;
  receipt: Receipt | null = null;
  instruction = `
    From the give image of receipt extract data and return JSON with given scheme: 
      {
        "date": "2025-01-01",
        "seller" : {
            "name":"nome of seller", 
            "taxNumber":"12341324132"
            "total": 120
        },
      "items": 
        [
          {
            "name": "product name",
            "price": 20, 
            "quantity": 6,
            "total": 120
          }
        ]
      }

    Make sure that returned data is correct JSON and don't have any surrounding characters. JUST JSON!`;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: FirebaseApp) {
    const vertexAI = getVertexAI(this.firebaseApp);

    this.model = getGenerativeModel(vertexAI, {
      model: this.modelId,
    });
  }

  async sendMessage(data: string, mimeType: string): Promise<Receipt | null> {
    this.loadingService.show();

    try {
      const messageParts = {
        inlineData: {
          mimeType,
          data: data.split(',')[1] ?? '',
        },
      };

      const res = await await this.model?.generateContent([
        this.instruction,
        messageParts,
      ]);

      if (res) {
        const receipt = this.cleanJsonStringForParsing(
          res?.response.text() ?? ''
        );

        //@ts-ignore
        receipt.uuid = res?.responseId ?? crypto.randomUUID();
        this.receipt = receipt;

        return this.receipt;
      } else {
        this.notificationService.showError(
          `Error processing image - make sure you send picture of receipt!`
        );
      }
    } catch (error) {
      console.error('Error getting receipt from image:', error);

      this.notificationService.showError(
        `Error processing image - make sure you send picture of receipt!`
      );

      return null;
    } finally {
      this.loadingService.hide();
      return this.receipt;
    }
  }

  cleanJsonStringForParsing(rawString: string) {
    if (typeof rawString !== 'string') {
      console.error('Input must be a string.');
      return null;
    }

    const match = rawString.match(/^```json\n([\s\S]*?)\n```$/);

    if (match && match[1] && match[1].trim() !== '') {
      let jsonContent = match[1];
      const cleanedContent = jsonContent.replace(/[\n\u00A0]/g, '');

      return JSON.parse(cleanedContent);
    } else {
      console.warn(
        'Input string does not match the expected ```json\\n...\\n``` format or the JSON content is empty.'
      );

      return null;
    }
  }
}
