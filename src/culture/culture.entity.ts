import { CountryEntity } from 'src/country/country.entity';
import { ProductEntity } from 'src/product/product.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CultureEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => [ProductEntity])
  @ManyToMany(() => ProductEntity, (product) => product.cultures)
  @JoinTable()
  products: ProductEntity[];

  @Field((type) => [CountryEntity])
  @OneToMany(() => CountryEntity, (country) => country.culture)
  @JoinTable()
  countries: CountryEntity[];

  @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.cultures)
  @JoinTable()
  restaurants: RestaurantEntity[];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.culture)
  recipes: RecipeEntity[];
}
