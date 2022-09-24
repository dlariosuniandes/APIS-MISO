import { Test, TestingModule } from '@nestjs/testing';
import { CultureProductService } from './culture-product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity';
import { CultureService } from '../culture/culture.service';
import { ProductService } from '../product/product.service';
import { CacheModule } from '@nestjs/common';

describe('CultureProductService', () => {
  let cultureProductProvider: CultureProductService;
  let cultureProvider: CultureService;
  let productProvider: ProductService;
  let productRepository: Repository<ProductEntity>;
  let cultureRepository: Repository<CultureEntity>;
  let productList: ProductEntity[];
  let cultureList: CultureEntity[];

  const generateProduct = () => {
    const productDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      story: faker.lorem.sentence(),
      category: faker.lorem.sentence(),
      cultures: [],
    };
    return productDict;
  };

  const generateCulture = () => {
    const cultureDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      products: [],
    };
    return cultureDict;
  };

  const seedDatabase = async () => {
    await cultureRepository.clear();
    await productRepository.clear();
    productList = [];
    cultureList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save(
        Object.assign(new ProductEntity(), generateProduct()),
      );
      const culture: CultureEntity = await cultureRepository.save(
        Object.assign(new CultureEntity(), generateCulture()),
      );
      productList.push(product);
      cultureList.push(culture);
    }
    productList[0].cultures = cultureList.slice(0, 2);
    productList[1].cultures = cultureList.slice(2, 5);
    productList.map(async (pr) => await productRepository.save(pr));
    for (let i = 0; i < productList.length; i++) {
      productList[i] = await productProvider.findOne(productList[i].id);
    }
    for (let i = 0; i < cultureList.length; i++) {
      cultureList[i] = await cultureProvider.findOne(cultureList[i].id);
    }
    cultureList[0].products = [
      ...cultureList[0].products,
      ...productList.slice(2, 4),
    ];
    cultureList[1].products = [...cultureList[1].products, productList[4]];
    cultureList.map(async (cu) => await cultureRepository.save(cu));
    for (let i = 0; i < cultureList.length; i++) {
      cultureList[i] = await cultureProvider.findOne(cultureList[i].id);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultureProductService, ProductService, CultureService],
      imports: [
        ...TypeOrmTestingConfig(),
        CacheModule.register({ ttl: 600, isGlobal: true }),
      ],
    }).compile();

    cultureProductProvider = module.get<CultureProductService>(
      CultureProductService,
    );
    cultureProvider = module.get<CultureService>(CultureService);
    productProvider = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    cultureRepository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    await seedDatabase();
  });

  it('should be defined', async () => {
    expect(cultureProductProvider).toBeDefined();
  });

  it('should add product to culture', async () => {
    const productId = productList[1].id;
    const cultureId = cultureList[1].id;
    await cultureProductProvider.addProductToCulture(productId, cultureId);
    const modifiedCulture: CultureEntity = await cultureProvider.findOne(
      cultureId,
    );
    const addedProduct: ProductEntity = await productProvider.findOne(
      productId,
    );
    expect(
      modifiedCulture.products.find((pr) => pr.id === productId).id,
    ).toEqual(productId);
    expect(addedProduct.cultures.find((cu) => cultureId === cu.id).id).toEqual(
      cultureId,
    );
  });

  it('should not add same product to culture twice', async () => {
    const productId = productList[1].id;
    const cultureId = cultureList[1].id;
    await cultureProductProvider.addProductToCulture(productId, cultureId);
    try {
      await cultureProductProvider.addProductToCulture(productId, cultureId);
    } catch {
      const modifiedCulture: CultureEntity = await cultureProvider.findOne(
        cultureId,
      );
      expect(modifiedCulture.products.length).toEqual(3);
    }
  });

  it('should add culture to product', async () => {
    const productId = productList[2].id;
    const cultureId = cultureList[2].id;
    await cultureProductProvider.addCultureToProduct(productId, cultureId);
    const modifiedProduct: ProductEntity = await productProvider.findOne(
      productId,
    );
    const addedCulture: CultureEntity = await cultureProvider.findOne(
      cultureId,
    );
    expect(
      modifiedProduct.cultures.find((cu) => cu.id === cultureId).id,
    ).toEqual(cultureId);
    expect(addedCulture.products.find((pr) => productId === pr.id).id).toEqual(
      productId,
    );
  });

  it('should not add same culture to product twice', async () => {
    const productId = productList[2].id;
    const cultureId = cultureList[2].id;
    await cultureProductProvider.addCultureToProduct(productId, cultureId);
    try {
      await cultureProductProvider.addCultureToProduct(productId, cultureId);
    } catch {
      const modifiedProduct: ProductEntity = await productProvider.findOne(
        productId,
      );
      expect(modifiedProduct.cultures.length).toEqual(2);
    }
  });

  it('should find culture in product', async () => {
    const productId = productList[0].id;
    const cultureId = cultureList[0].id;
    const culture: CultureEntity =
      await cultureProductProvider.findCultureByProductIdCultureId(
        productId,
        cultureId,
      );
    expect(culture).toBeDefined();
  });

  it('should find product in culture', async () => {
    const productId = productList[0].id;
    const cultureId = cultureList[0].id;
    const product: ProductEntity =
      await cultureProductProvider.findProductByCultureIdProductId(
        productId,
        cultureId,
      );
    expect(product).toBeDefined();
  });

  it('should return all products in culture', async () => {
    const cultureId = cultureList[0].id;
    const products: ProductEntity[] =
      await cultureProductProvider.findProductsByCultureId(cultureId);
    expect(products.length).toEqual(3);
  });

  it('should return all cultures in product', async () => {
    const productId = productList[0].id;
    const cultures: CultureEntity[] =
      await cultureProductProvider.findCulturesByProductId(productId);
    expect(cultures.length).toEqual(2);
  });

  it('should associate cultures to product', async () => {
    const productId = productList[0].id;
    const newCultures: CultureEntity[] = await cultureProvider.findAll();
    const newCulturesIds: string[] = newCultures.map((culture) => culture.id);
    await cultureProductProvider.associateCulturesToProduct(
      productId,
      newCulturesIds,
    );
    const product = await productProvider.findOne(productId);
    expect(product.cultures.length).toEqual(5);
  });

  it('should associate products to culture', async () => {
    const cultureId = cultureList[0].id;
    const newProducts: ProductEntity[] = await productProvider.findAll(0, 5);
    const newProductsIds: string[] = newProducts.map((product) => product.id);
    await cultureProductProvider.associateProductsToCulture(
      cultureId,
      newProductsIds,
    );
    const culture = await cultureProvider.findOne(cultureId);
    expect(culture.products.length).toEqual(5);
  });

  it('should delete product from culture', async () => {
    const cultureId = cultureList[0].id;
    const productId = productList[0].id;
    await cultureProductProvider.deleteProductFromCulture(productId, cultureId);
    const culture: CultureEntity = await cultureProvider.findOne(cultureId);
    expect(culture.products.length).toEqual(2);
  });

  it('should delete culture from product', async () => {
    const cultureId = cultureList[0].id;
    const productId = productList[0].id;
    await cultureProductProvider.deleteCultureFromProduct(productId, cultureId);
    const product: ProductEntity = await productProvider.findOne(productId);
    expect(product.cultures.length).toEqual(1);
  });
});
