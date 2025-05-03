import { CreateUserDto } from '@app/common';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id: number;
}
