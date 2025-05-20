import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrierDto } from './create-carriers.dto';

export class UpdateCarrierDto extends PartialType(CreateCarrierDto) {}