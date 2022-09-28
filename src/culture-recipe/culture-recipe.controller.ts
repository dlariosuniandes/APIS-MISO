import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecipeDto } from 'src/recipe/recipe.dto';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureRecipeService } from './culture-recipe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Cultures - Recipes')
@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class CultureRecipeController {
  constructor(private readonly cultureRecipeService: CultureRecipeService) {}

  @Post(':cultureId/recipes')
  async addRecipeToCulture(
    @Param('cultureId') cultureId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
    return await this.cultureRecipeService.addRecipeToCulture(
      cultureId,
      recipe,
    );
  }

  @Roles(Role.Creator, Role.Reader)
  @Put(':cultureId/recipes')
  async updateCultureRecipes(
    @Param('cultureId') cultureId: string,
    @Body() recipesDto: RecipeDto[],
  ) {
    const recipes = plainToInstance(RecipeEntity, recipesDto);
    return await this.cultureRecipeService.updateCultureRecipes(
      cultureId,
      recipes,
    );
  }

  @Roles(Role.Reader, Role.Creator)
  @Get(':cultureId/recipes/:recipeId')
  async findRecipeByCultureIdRecipeId(
    @Param('cultureId') cultureId: string,
    @Param('recipeId') recipeId: string,
  ) {
    return await this.cultureRecipeService.findRecipeByCultureIdRecipeId(
      recipeId,
      cultureId,
    );
  }

  @Roles(Role.Reader, Role.Creator)
  @Get(':cultureId/recipes')
  async findRecipesByCultureId(@Param('cultureId') cultureId: string) {
    return await this.cultureRecipeService.findRecipesByCultureId(cultureId);
  }

  @Roles(Role.Remover)
  @Delete(':cultureId/recipes/:recipeId')
  @HttpCode(204)
  async deleteRecipeCulture(
    @Param('cultureId') cultureId: string,
    @Param('recipeId') recipeId: string,
  ) {
    return await this.cultureRecipeService.deleteRecipeFromCulture(
      recipeId,
      cultureId,
    );
  }
}
