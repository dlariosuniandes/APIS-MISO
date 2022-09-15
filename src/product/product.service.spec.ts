import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEnum } from '../enums/category.enum';

describe('ProductService', () => {
  let provider: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[];

  const generateProduct = () => {
    const productDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      story: faker.lorem.sentence(),
      category: faker.lorem.sentence(),
    };
    return productDict;
  };

  const seedDatabase = async () => {
    await repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save(generateProduct());
      productList.push(product);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    provider = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('products list length should be 5', async () => {
    const products: ProductEntity[] = await provider.findAll();
    expect(products).not.toBeNull();
    expect(products.length).toBe(5);
  });

  it('existing product should be found', async () => {
    const storedProduct: ProductEntity = productList[productList.length - 1];
    const product: ProductEntity = await provider.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    const productObj = JSON.parse(JSON.stringify(product));
    delete productObj['cultures'];
    expect(productObj).toEqual(JSON.parse(JSON.stringify(storedProduct)));
  });

  it('should create a new product', async () => {
    const newProduct = Object.assign(new ProductEntity(), generateProduct());
    await provider.create(newProduct);
    const newStoredProduct = await provider.findOne(newProduct.id);
    expect(newStoredProduct).not.toBeNull();
    const newStoredProductObj = JSON.parse(JSON.stringify(newStoredProduct));
    delete newStoredProductObj['cultures'];
    expect(JSON.parse(JSON.stringify(newProduct))).toEqual(newStoredProductObj);
  });

  it('should edit an existing product', async () => {
    const editingProduct = productList[productList.length - 1];
    editingProduct.story = faker.lorem.sentence();
    let storedProduct: ProductEntity = await provider.findOne(
      editingProduct.id,
    );
    const { cultures, ...rest } = JSON.parse(JSON.stringify(storedProduct));
    expect(storedProduct).not.toBeNull();
    expect(JSON.parse(JSON.stringify(editingProduct))).not.toBe(rest);
    await provider.updateOne(editingProduct.id, editingProduct);
    storedProduct = await provider.findOne(editingProduct.id);
    const storedProductObj = JSON.parse(JSON.stringify(storedProduct));
    delete storedProductObj['cultures'];
    expect(JSON.parse(JSON.stringify(editingProduct))).toEqual(
      storedProductObj,
    );
  });

  it('should delete an existing product', async () => {
    await provider.deleteOne(productList[0].id);
    const products: ProductEntity[] = await provider.findAll();
    expect(products.length).toEqual(4);
  });

  afterAll(() => {
    repository.clear();
  });
});
