import { CountryEntity } from 'src/country/country.entity';
import { ProductEntity } from 'src/product/product.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CultureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => ProductEntity, (product) => product.cultures)
  products: ProductEntity[];

  @ManyToMany(() => CountryEntity, (country) => country.cultures)
  countries: CountryEntity[];

  @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.cultures)
  restaurants: RestaurantEntity[];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.culture)
  recipes: RecipeEntity[];
}
