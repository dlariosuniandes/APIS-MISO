import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureService } from 'src/culture/culture.service';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CultureRecipeService } from './culture-recipe.service';
import {CacheModule} from "@nestjs/common";

describe('CultureRecipeService', () => {
  let cultureRecipeProvider: CultureRecipeService;
  let cultureProvider: CultureService;
  let recipeProvider: RecipeService;
  let recipeRepository: Repository<RecipeEntity>;
  let cultureRepository: Repository<CultureEntity>;
  let recipeList: RecipeEntity[];
  let cultureList: CultureEntity[];

  const propertyExcepetionResourceNotFound = 'message';
  const messageExcepetionCultureNotFound =
    'The culture with the given id was not found';
  const messageExcepetionRecipeNotFound =
    'The recipe with the given id was not found';
  const messageExcepetionNotAsocciation =
    'The recipe with the given id is not associated to the culture';

  const generateRecipe = () => {
    const recipeDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      url_photo: faker.internet.url(),
      url_video: faker.internet.url(),
    };
    return recipeDict;
  };

  const generateCulture = () => {
    const cultureDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      recipes: [],
    };
    return cultureDict;
  };

  const seedDatabase = async () => {
    await cultureRepository.clear();
    await recipeRepository.clear();
    recipeList = [];
    cultureList = [];
    const culture: CultureEntity = await cultureRepository.save(
      Object.assign(new CultureEntity(), generateCulture()),
    );

    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = Object.assign(
        new RecipeEntity(),
        generateRecipe(),
      );
      recipe.culture = culture;
      const storedRecipe = await recipeRepository.save(recipe);
      recipeList.push(storedRecipe);
    }
    const updatedCulture: CultureEntity = await cultureProvider.findOne(
      culture.id,
    );
    cultureList.push(updatedCulture);
    for (let i = 0; i < recipeList.length; i++) {
      recipeList[i] = await recipeProvider.findOne(recipeList[i].id);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureRecipeService, RecipeService, CultureService],
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
    }).compile();

    cultureRecipeProvider =
      module.get<CultureRecipeService>(CultureRecipeService);
    cultureProvider = module.get<CultureService>(CultureService);
    recipeProvider = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );
    cultureRepository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(cultureRecipeProvider).toBeDefined();
  });

  it('should add recipe to a culture', async () => {
    let culture: CultureEntity = cultureList[0];
    const newRecipe: RecipeEntity = Object.assign(
      new RecipeEntity(),
      generateRecipe(),
    );
    culture = await cultureRecipeProvider.addRecipeToCulture(
      culture.id,
      newRecipe,
    );
    expect(culture.recipes.length).toEqual(6);
  });

  it('should add recipe to a culture should throw an exception for an invalid culture', async () => {
    const recipe = Object.assign(new RecipeEntity(), generateRecipe());
    let culture = null;
    try {
      culture = await cultureRecipeProvider.addRecipeToCulture('0', recipe);
    } catch {
      expect(culture).toBeNull();
    }
  });

  it('should find recipe in culture', async () => {
    const recipeId = recipeList[1].id;
    const cultureId = cultureList[0].id;
    const recipe: RecipeEntity =
      await cultureRecipeProvider.findRecipeByCultureIdRecipeId(
        recipeId,
        cultureId,
      );
    expect(recipe).toBeDefined();
  });

  it('should return all recipes in culture', async () => {
    const cultureId = cultureList[0].id;
    const newRecipes: RecipeEntity[] =
      await cultureRecipeProvider.findRecipesByCultureId(cultureId);
    expect(newRecipes.length).toEqual(5);
  });

  it('should update culture recipe list', async () => {
    let culture: CultureEntity = cultureList[0];
    const newRecipeList: RecipeEntity[] = [];
    for (let i = 0; i < 3; i++) {
      newRecipeList.push(Object.assign(new RecipeEntity(), generateRecipe()));
    }

    culture = await cultureRecipeProvider.updateCultureRecipes(
      culture.id,
      newRecipeList,
    );

    expect(culture.recipes.length).toEqual(3);
    const storedRecipes: RecipeEntity[] = await recipeProvider.findAll();
    expect(storedRecipes.length).toEqual(3);
  });

  it('should remove a recipe from certain culture', async () => {
    let culture = cultureList[0];
    const undesiredRecipe = recipeList[recipeList.length - 1];
    culture = await cultureRecipeProvider.deleteRecipeFromCulture(
      undesiredRecipe.id,
      culture.id,
    );
    const storedRecipes: RecipeEntity[] = await recipeProvider.findAll();
    expect(culture.recipes.length).toEqual(4);
    expect(storedRecipes.length).toEqual(4);
  });

  it('Should remove all recipes from removed culture', async () => {
    const culture = cultureList[0];
    await cultureProvider.delete(culture.id);
    const storedRecipes: RecipeEntity[] = await recipeProvider.findAll();
    expect(storedRecipes.length).toEqual(0);
  });
});
