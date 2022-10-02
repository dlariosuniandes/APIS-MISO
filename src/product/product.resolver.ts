import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductDto } from './product.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [ProductEntity])
  async products(
    @Args('skip', { defaultValue: 0 }) skip: number,
    @Args('amount', { defaultValue: 100 }) amount: number,
  ): Promise<ProductEntity[]> {
    return await this.productService.findAll(skip, amount);
  }

  @Query(() => ProductEntity)
  async product(@Args('id') id: string): Promise<ProductEntity> {
    return await this.productService.findOne(id);
  }

  @Mutation(() => ProductEntity)
  async createProduct(
    @Args('productDto')
    productDto: ProductDto,
  ): Promise<ProductEntity> {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(product);
  }

  @Mutation(() => ProductEntity)
  async updateProduct(
    @Args('productId')
    productId: string,
    @Args('productDto')
    productDto: ProductDto,
  ): Promise<ProductEntity> {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.updateOne(productId, product);
  }

  @Mutation(() => String)
  async deleteProduct(
    @Args('productId')
    productId: string,
  ) {
    await this.productService.deleteOne(productId);
    return productId;
  }
}
