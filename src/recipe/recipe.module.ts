import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeResolver } from './recipe.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeService, RecipeResolver],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
