import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CultureProductService } from './culture-product.service';
import { CultureEntity } from '../culture/culture.entity';
import { ProductEntity } from '../product/product.entity';

@Resolver()
export class ProductCultureResolver {
  constructor(private cultureProductService: CultureProductService) {}

  @Query(() => [CultureEntity])
  async productCultures(
    @Args('productId') productId: string,
  ): Promise<CultureEntity[]> {
    return await this.cultureProductService.findCulturesByProductId(productId);
  }

  @Query(() => CultureEntity)
  async productCulture(
    @Args('productId') productId: string,
    @Args('cultureId') cultureId: string,
  ): Promise<CultureEntity> {
    return await this.cultureProductService.findCultureByProductIdCultureId(
      productId,
      cultureId,
    );
  }

  @Mutation(() => ProductEntity)
  async addProductCulture(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
    return await this.cultureProductService.addCultureToProduct(
      productId,
      cultureId,
    );
  }

  @Mutation(() => ProductEntity)
  async removeProductCulture(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
    return await this.cultureProductService.deleteCultureFromProduct(
      productId,
      cultureId,
    );
  }

  @Mutation(() => ProductEntity)
  async updateProductCultures(
    @Args('culturesIds', { type: () => [String] }) culturesIds: string[],
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
    return await this.cultureProductService.associateCulturesToProduct(
      productId,
      culturesIds,
    );
  }
}
