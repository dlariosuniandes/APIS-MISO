import { CountryEntity } from 'src/country/country.entity';
import { ProductEntity } from 'src/product/product.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CultureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ProductEntity, (product) => product.culture)
  products: ProductEntity[];

  @OneToMany(() => CountryEntity, (country) => country.culture)
  countries: CountryEntity[];

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.cultures)
  restaurants: RestaurantEntity[];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.culture)
  recipes: RecipeEntity[];
}
