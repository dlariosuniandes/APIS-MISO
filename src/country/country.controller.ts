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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { CountryService } from './country.service';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authorization/role.decorator';
import { Role } from 'src/authorization/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Countries')
@UseInterceptors(BusinessErrorsInterceptor)
@ApiBearerAuth()
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Reader, Role.Creator)
  @Get()
  async findAll(@Query('skip') skip = 0, @Query('amount') amount = 50000) {
    return await this.countryService.findAll(skip, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Reader, Role.Creator)
  @Get(':countryId')
  async findOne(@Param('countryId') countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Creator)
  @Post()
  async create(@Body() countryDto: CountryDto) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.create(country);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Creator)
  @Put(':countryId')
  async update(
    @Param('countryId') countryId: string,
    @Body() countryDto: CountryDto,
  ) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.update(countryId, country);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Creator)
  @Delete(':countryId')
  @HttpCode(204)
  async delete(@Param('countryId') countryId: string) {
    await this.countryService.delete(countryId);
  }
}
