import { Component, inject, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Receipt } from '../models/receipt.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-receipts',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: './my-receipts.component.html',
  styleUrl: './my-receipt.component.scss',
})
export class MyReceiptsComponent implements OnInit {
  dbService = inject(DbService);
  titleService = inject(Title);

  title = 'ParagonR - My Receipts';
  data: Receipt[] = [];

  ngOnInit() {
    this.data = this.dbService.getData();
    this.titleService.setTitle(this.title);
  }

  countTotal() {
    return this.data
      .reduce((acc, item) => acc + item.seller.total, 0)
      .toFixed(2);
  }

  removeReceipt(uuid: string) {
    this.dbService.removeItem(uuid);
    this.data = this.dbService.getData();
  }
}
