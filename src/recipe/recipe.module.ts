import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeService],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
