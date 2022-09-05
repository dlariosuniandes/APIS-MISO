import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CultureEntity } from '../culture/culture.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { ProductService } from '../product/product.service';
import { CultureService } from '../culture/culture.service';

@Injectable()
export class CultureProductService {
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private productService: ProductService,
    private cultureService: CultureService,
  ) {}

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
    return await this.cultureRepository.save(culture);
  }

  async addCultureToProduct(
    productId: string,
    cultureId: string,
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (product.cultures.find((cu) => cu.id === cultureId)) {
      throw new ConflictException('Culture already has this product');
    }
    product.cultures.push(culture);
    return await this.productRepository.save(product);
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
    const product: ProductEntity = await this.productService.findOne(productId);
    return product.cultures;
  }

  async findProductsByCultureId(cultureId: string): Promise<ProductEntity[]> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    return culture.products;
  }

  async associateCulturesToProduct(
    productId: string,
    cultures: CultureEntity[],
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    product.cultures = cultures;
    return await this.productRepository.save(product);
  }

  async associateProductsToCulture(
    cultureId: string,
    products: ProductEntity[],
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    culture.products = products;
    return await this.cultureRepository.save(culture);
  }

  async deleteProductFromCulture(productId, cultureId): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    const undesiredProduct: ProductEntity = this.findProductInCulture(
      productId,
      culture,
    );
    culture.products = culture.products.filter((pr) => pr !== undesiredProduct);
    return await this.cultureRepository.save(culture);
  }

  async deleteCultureFromProduct(productId, cultureId): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const undesiredCulture: CultureEntity = this.findCultureInProduct(
      cultureId,
      product,
    );
    product.cultures = product.cultures.filter((cu) => cu !== undesiredCulture);
    return await this.productRepository.save(product);
  }
}
