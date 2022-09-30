import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
@Entity()
export class ProductEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  story: string;

  @Field()
  @Column()
  category: string;

  @Field((type) => [CultureEntity])
  @ManyToMany(() => CultureEntity, (culture) => culture.products)
  cultures: CultureEntity[];
}
