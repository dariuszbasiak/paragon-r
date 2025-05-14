import { Injectable } from '@angular/core';
import { Receipt } from '../models/receipt.interface';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  data: Receipt[] = [];

  constructor() {
    this.data = this.getData();
  }

  getData(): Receipt[] {
    const data = localStorage.getItem('paragon-r') ?? '';
    if (!data) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing receipts from localStorage', e);
    }
    return [];
  }

  saveItem(value: Receipt) {
    if (!value.uuid) {
      value.uuid = crypto.randomUUID(); // Generate UUID if not present
    }
    this.data.push(value);
    localStorage.setItem('paragon-r', JSON.stringify(this.data));
  }

  updateItem(value: Receipt) {
    if (!value.uuid) {
      console.error('Cannot update item without UUID', value);
      return;
    }
    const index = this.data.findIndex((item) => item.uuid === value.uuid);
    if (index !== -1) {
      this.data[index] = value;
      localStorage.setItem('paragon-r', JSON.stringify(this.data)); // Persist update
    }
  }

  removeItem(uuid: string) {
    this.data = this.data.filter((item) => item.uuid !== uuid);
    localStorage.setItem('paragon-r', JSON.stringify(this.data));
  }
}
