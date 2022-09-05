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
      await recipeRepository.save(recipe);
    }
    const updatedCulture: CultureEntity = await cultureProvider.findOne(
      culture.id,
    );
    cultureList.push(updatedCulture);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureRecipeService, RecipeService, CultureService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    cultureRecipeProvider =
      module.get<CultureRecipeService>(CultureRecipeService);
    cultureProvider = module.get<CultureService>(CultureService);
    recipeProvider = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(CultureEntity),
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
    const culture: CultureEntity = Object.assign(
      new CultureEntity(),
      cultureList[0],
    );
    const cultureId = culture.id;
    const newCulture: CultureEntity =
      await cultureRecipeProvider.addRecipeToCulture(cultureId, recipeList[2]);
    const recipeId = r.id;
    expect(culture.recipes[2].id).toBe(recipeId);
    expect(culture.recipes[2]).not.toBeNull();
    expect(culture.recipes.length).toBe(4);
  });
  it('should add recipe to a culture should throw an exception for an invalid culture', async () => {
    await cultureProvider.create(cultureList[0]);
    await expect(() =>
      cultureRecipeProvider.addRecipeToCulture('0', recipeList[2]),
    ).rejects.toHaveProperty(
      propertyExcepetionResourceNotFound,
      messageExcepetionCultureNotFound,
    );
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
    expect(newRecipes.length).toBe(5);
  });
});
