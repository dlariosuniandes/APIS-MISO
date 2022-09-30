import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';

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
}
