import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CultureProductService } from './culture-product.service';
import { ProductEntity } from '../product/product.entity';
import { CultureEntity } from '../culture/culture.entity';

@Resolver()
export class CultureProductResolver {
  constructor(private cultureProductService: CultureProductService) {}

  @Query(() => [ProductEntity])
  async cultureProducts(
    @Args('cultureId') cultureId: string,
  ): Promise<ProductEntity[]> {
    return await this.cultureProductService.findProductsByCultureId(cultureId);
  }

  @Query(() => ProductEntity)
  async cultureProduct(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
    return await this.cultureProductService.findProductByCultureIdProductId(
      productId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async addCultureProduct(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<CultureEntity> {
    return await this.cultureProductService.addProductToCulture(
      productId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async removeCultureProduct(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<CultureEntity> {
    return await this.cultureProductService.deleteProductFromCulture(
      productId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async updateCultureProducts(
    @Args('cultureId') cultureId: string,
    @Args('productsIds', { type: () => [String] }) productsIds: string[],
  ): Promise<CultureEntity> {
    return await this.cultureProductService.associateProductsToCulture(
      cultureId,
      productsIds,
    );
  }
}
