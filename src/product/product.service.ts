import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async findAll(skip: number, amount: number): Promise<ProductEntity[]> {
    const cacheKey = `products.skip_${skip}.amount_${amount}`;
    const cached: ProductEntity[] = await this.cacheManager.get<
      ProductEntity[]
    >(cacheKey);
    if (!cached) {
      const products: ProductEntity[] = await this.productRepository.find({
        skip: skip,
        take: amount,
      });
      await this.cacheManager.set<ProductEntity[]>(cacheKey, products);
      return products;
    }
    return cached;
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: id },
      relations: ['cultures'],
    });
    if (!product) {
      throw new NotFoundException(
        'The product with the given id was not found',
      );
    }
    return product;
  }

  async updateOne(
    searchedId: string,
    product: ProductEntity,
  ): Promise<ProductEntity> {
    const productDB: ProductEntity = await this.productRepository.findOne({
      where: { id: searchedId },
      relations: ['cultures'],
    });
    if (!productDB) {
      throw new NotFoundException(
        'The product with the given id was not found',
      );
    }
    const { id, ...rest } = product;
    return await this.productRepository.save({ ...productDB, ...rest });
  }

  async deleteOne(id: string): Promise<string> {
    const productDB: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['cultures'],
    });
    if (!productDB) {
      throw new NotFoundException(
        'The product with the given id was not found',
      );
    }
    await this.productRepository.remove(productDB);
    return `product ${id} was successfully removed`;
  }
}
