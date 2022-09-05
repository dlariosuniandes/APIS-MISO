import { Module } from '@nestjs/common';
import { CultureProductService } from './culture-product.service';

@Module({
  providers: [CultureProductService]
})
export class CultureProductModule {}
