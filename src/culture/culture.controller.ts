import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureDto } from './culture.dto';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Cultures')
@UseInterceptors(BusinessErrorsInterceptor)
@ApiBearerAuth()
@Controller('cultures')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  @Roles(Role.READ_ONLY)
  @Get()
  async findAll(@Query('skip') skip = 0, @Query('amount') amount = 1000) {
    return await this.cultureService.findAll(skip, amount);
  }

  @Roles(Role.READ_ONLY)
  @Get(':cultureId')
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.cultureService.findOne(cultureId);
  }

  @Roles(Role.ALLOW_CREATE)
  @Post()
  async create(@Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.create(culture);
  }

  @Roles(Role.ALLOW_MODIFY)
  @Put(':cultureId')
  async update(
    @Param('cultureId') cultureId: string,
    @Body() cultureDto: CultureDto,
  ) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.update(cultureId, culture);
  }

  @Roles(Role.ALLOW_DELETE)
  @Delete(':cultureId')
  @HttpCode(204)
  async delete(@Param('cultureId') cultureId: string) {
    await this.cultureService.delete(cultureId);
  }
}
