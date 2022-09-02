import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<ProductEntity> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['cultures'],
    });
  }

  async updateOne(id: string, product: ProductEntity): Promise<ProductEntity> {
    const productDB: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['cultures'],
    });
    if (!productDB) {
      throw new NotFoundException(
        'The culture with the given id was not found',
      );
    }
    return await this.productRepository.save({ ...productDB, ...product });
  }

  async deleteOne(id: string): Promise<string> {
    const productDB: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['cultures'],
    });
    if (!productDB) {
      throw new NotFoundException(
        'The culture with the given id was not found',
      );
    }
    await this.productRepository.remove(productDB);
    return `product ${id} was successfully removed`;
  }
}
