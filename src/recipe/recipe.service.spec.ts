import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let recipeList: RecipeEntity[];

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

  const seedDatabase = async () => {
    await repository.clear();
    recipeList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await repository.save(generateRecipe());
      recipeList.push(recipe);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new recipe', async () => {
    const newRecipe = Object.assign(new RecipeEntity(), generateRecipe());
    await service.create(newRecipe);
    const newStoredRecipe = await service.findOne(newRecipe.id);
    expect(newStoredRecipe).not.toBeNull();
    const newStoredRecipeObj = JSON.parse(JSON.stringify(newStoredRecipe));
    delete newStoredRecipeObj['culture'];
    expect(JSON.parse(JSON.stringify(newRecipe))).toEqual(newStoredRecipeObj);
  });

  it('existing recipes should be found', async () => {
    const storedRecipe: RecipeEntity = recipeList[recipeList.length - 1];
    const recipe: RecipeEntity = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    const recipeObj = JSON.parse(JSON.stringify(recipe));
    delete recipeObj['culture'];
    expect(recipeObj).toEqual(JSON.parse(JSON.stringify(storedRecipe)));
  });

  it('should edit an existing recipe', async () => {
    const editingRecipe = recipeList[recipeList.length - 1];
    editingRecipe.preparation = faker.lorem.sentence();
    let storedRecipe: RecipeEntity = await service.findOne(
      editingRecipe.id,
    );
    const { culture, ...rest } = JSON.parse(JSON.stringify(storedRecipe));
    expect(storedRecipe).not.toBeNull();
    expect(JSON.parse(JSON.stringify(editingRecipe))).not.toBe(rest);
    await service.updateOne(editingRecipe.id, editingRecipe);
    storedRecipe = await service.findOne(editingRecipe.id);
    const storedRecipeObj = JSON.parse(JSON.stringify(storedRecipe));
    delete storedRecipeObj['culture'];
    expect(JSON.parse(JSON.stringify(editingRecipe))).toEqual(storedRecipeObj);
  });

  it('should delete an existing recipe', async () => {
    await service.deleteOne(recipeList[0].id);
    const recipes: RecipeEntity[] = await service.findAll();
    expect(recipes.length).toEqual(4);
  });

  afterAll(() => {
    repository.clear();
  });
});
