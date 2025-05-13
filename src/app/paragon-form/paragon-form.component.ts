import { Component, inject, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Recipe } from '../models/recipe.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DbService } from '../services/db.service';
import { RouterModule, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-paragon-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './paragon-form.component.html',
  styleUrl: './paragon-form.component.scss',
})
export class ParagonFormComponent {
  dbService = inject(DbService);
  router = inject(Router);
  fb = inject(FormBuilder);

  @Input() data: Recipe | null = null;

  form = new FormGroup({
    date: new FormControl(''),
    seller: new FormGroup({
      name: new FormControl(''),
      taxNumber: new FormControl(''),
      total: new FormControl(0),
    }),
    items: new FormArray([
      new FormGroup({
        name: new FormControl(''),
        price: new FormControl(0),
        quantity: new FormControl(0),
        total: new FormControl(0),
      }),
    ]),
  });

  ngOnChanges() {
    if (this.data) {
      this.form = this.createFrom(this.data);
      console.log(this.form);
    }
  }

  createFrom(data: Recipe): FormGroup {
    return this.fb.group({
      date: [data.date],
      seller: this.fb.group({
        name: [data.seller.name],
        taxNumber: [data.seller.taxNumber],
        total: [data.seller.total],
      }),
      items: this.fb.array(
        data.items.map((item) =>
          this.fb.group({
            name: [item.name],
            price: [item.price],
            quantity: [item.quantity],
            total: [item.total],
          })
        )
      ),
    });
  }

  save() {
    this.dbService.saveItem(this.form.value as Recipe);
    this.router.navigate(['/my-recipes']);
  }

  removeItem(index: number) {
    const items = this.form.get('items') as FormArray;
    items.removeAt(index);
  }
}
