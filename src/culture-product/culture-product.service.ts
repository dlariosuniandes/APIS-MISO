import {
  ConflictException,
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { CultureEntity } from '../culture/culture.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { ProductService } from '../product/product.service';
import { CultureService } from '../culture/culture.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CultureProductService {
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private productService: ProductService,
    private cultureService: CultureService,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  private async removeActualKeys(matchingChars: string) {
    const keys: string[] = await this.cacheManager.store.keys();
    const productsKeys = keys.filter((key) => key.search(matchingChars) === 0);
    productsKeys.map(async (key) => await this.cacheManager.del(key));
  }

  private findProductInCulture(
    productId,
    culture: CultureEntity,
  ): ProductEntity {
    const interestProduct: ProductEntity = culture.products.find(
      (pr) => pr.id === productId,
    );
    if (!interestProduct) {
      throw new PreconditionFailedException(
        'product with the given id is not associated to that culture',
      );
    }
    return interestProduct;
  }

  private findCultureInProduct(
    cultureId,
    product: ProductEntity,
  ): CultureEntity {
    const interestCulture: CultureEntity = product.cultures.find(
      (cu) => cu.id === cultureId,
    );
    if (!interestCulture) {
      throw new PreconditionFailedException(
        'culture with the given id is not associated to that product',
      );
    }
    return interestCulture;
  }

  async addProductToCulture(
    productId: string,
    cultureId: string,
  ): Promise<CultureEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (culture.products.find((pr) => pr.id === productId)) {
      throw new ConflictException('Culture already has this product');
    }
    culture.products.push(product);
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesProducts.cultureId.${cultureId}.products`,
    );
    return newCulture;
  }

  async addCultureToProduct(
    productId: string,
    cultureId: string,
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (product.cultures.find((cu) => cu.id === cultureId)) {
      throw new ConflictException('Product already has this culture');
    }
    product.cultures.push(culture);
    const newProduct = await this.productRepository.save(product);
    await this.removeActualKeys(
      `CulturesProducts.productId.${productId}.cultures`,
    );
    return newProduct;
  }

  async findProductByCultureIdProductId(
    productId: string,
    cultureId: string,
  ): Promise<ProductEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    return this.findProductInCulture(productId, culture);
  }

  async findCultureByProductIdCultureId(
    productId: string,
    cultureId: string,
  ): Promise<CultureEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    return this.findCultureInProduct(cultureId, product);
  }

  async findCulturesByProductId(productId: string): Promise<CultureEntity[]> {
    const cacheKey = `CulturesProducts.productId.${productId}.cultures`;
    const cached: CultureEntity[] = await this.cacheManager.get<
      CultureEntity[]
    >(cacheKey);
    if (!cached) {
      const product: ProductEntity = await this.productService.findOne(
        productId,
      );
      const cultures: CultureEntity[] = product.cultures;
      await this.cacheManager.set(cacheKey, cultures);
      return cultures;
    }
    return cached;
  }

  async findProductsByCultureId(cultureId: string): Promise<ProductEntity[]> {
    const cacheKey = `CulturesProducts.cultureId.${cultureId}.products`;
    const cached: ProductEntity[] = await this.cacheManager.get<
      ProductEntity[]
    >(cacheKey);
    if (!cached) {
      const culture: CultureEntity = await this.cultureService.findOne(
        cultureId,
      );
      const products: ProductEntity[] = culture.products;
      await this.cacheManager.set(cacheKey, products);
      return products;
    }
    return cached;
  }

  async associateCulturesToProduct(
    productId: string,
    culturesIds: string[],
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const newCultures = [];
    for (let i = 0; i < culturesIds.length; i++) {
      newCultures.push(await this.cultureService.findOne(culturesIds[i]));
    }
    product.cultures = newCultures;
    const newProduct = await this.productRepository.save(product);
    await this.removeActualKeys(
      `CulturesProducts.productId.${productId}.cultures`,
    );
    return newProduct;
  }

  async associateProductsToCulture(
    cultureId: string,
    productsIds: string[],
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    const newProducts = [];
    for (let i = 0; i < productsIds.length; i++) {
      newProducts.push(await this.productService.findOne(productsIds[i]));
    }
    culture.products = newProducts;
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesProducts.cultureId.${cultureId}.products`,
    );
    return newCulture;
  }

  async deleteProductFromCulture(productId, cultureId): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    const undesiredProduct: ProductEntity = this.findProductInCulture(
      productId,
      culture,
    );
    culture.products = culture.products.filter((pr) => pr !== undesiredProduct);
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesProducts.cultureId.${cultureId}.products`,
    );
    return newCulture;
  }

  async deleteCultureFromProduct(
    productId: string,
    cultureId: string,
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const undesiredCulture: CultureEntity = this.findCultureInProduct(
      cultureId,
      product,
    );
    product.cultures = product.cultures.filter((cu) => cu !== undesiredCulture);
    const newProduct = await this.productRepository.save(product);
    await this.removeActualKeys(
      `CulturesProducts.productId.${productId}.cultures`,
    );
    return newProduct;
  }
}
