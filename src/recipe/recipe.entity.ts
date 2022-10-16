import { Field, ObjectType } from '@nestjs/graphql';
import { CultureEntity } from 'src/culture/culture.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class RecipeEntity {
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
  preparation: string;

  @Field()
  @Column()
  url_photo: string;

  @Field()
  @Column()
  url_video: string;

  @Field((type) => CultureEntity)
  @ManyToOne(() => CultureEntity, (culture) => culture.recipes, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  culture: CultureEntity;
}
