import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureDto } from './culture.dto';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Cultures')
@UseInterceptors(BusinessErrorsInterceptor)
@ApiBearerAuth()
@Controller('cultures')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Roles(Role.Reader, Role.Creator)
  @Get()
  async findAll() {
    return await this.cultureService.findAll();
  }

  @Get(':cultureId')
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.cultureService.findOne(cultureId);
  }

  @Post()
  async create(@Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.create(culture);
  }

  @Put(':cultureId')
  async update(
    @Param('cultureId') cultureId: string,
    @Body() cultureDto: CultureDto,
  ) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.update(cultureId, culture);
  }

  @Delete(':cultureId')
  @HttpCode(204)
  async delete(@Param('cultureId') cultureId: string) {
    await this.cultureService.delete(cultureId);
  }
}
