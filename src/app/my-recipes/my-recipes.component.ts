import { Component, inject, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Recipe } from '../models/recipe.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-recipes',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: './my-recipes.component.html',
  styleUrl: './my-recipes.component.scss',
})
export class MyRecipesComponent implements OnInit {
  dbService = inject(DbService);
  titleService = inject(Title);

  title = 'ParagonR - My Recipes';
  data: Recipe[] = [];

  ngOnInit() {
    this.data = this.dbService.getData();
    this.titleService.setTitle(this.title);
  }

  countTotal() {
    return this.data.reduce((acc, item) => acc + item.seller.total, 0);
  }

  removeRecipe(uuid: string) {
    this.dbService.removeItem(uuid);
    this.data = this.dbService.getData();
  }
}
