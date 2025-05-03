import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/common/user/dto/create-user.dto';
import { UserCmd } from '@app/common';
import { PaginationQueryDto } from '@app/common/dto/pagination-query.dto';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @MessagePattern(UserCmd.CREATE_USER)
    async create(@Payload() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @MessagePattern(UserCmd.LIST_USER)
    async findAll(
        @Payload() paginationQuery: PaginationQueryDto,
    ) {
        return await this.usersService.findAll(paginationQuery);
    }

    @MessagePattern(UserCmd.GET_USER)
    async findOne(@Payload() id: number) {
        return await this.usersService.findOne(id);
    }

    @MessagePattern(UserCmd.GET_USER_BY_EMAIL_FOR_AUTH)
    async findOneByEmailForAuth(@Payload() email: string) {
        return await this.usersService.findOneByEmailForAuth(email);
    }

    @MessagePattern(UserCmd.UPDATE_USER)
    async update(@Payload() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(updateUserDto.id, updateUserDto);
    }

    @MessagePattern(UserCmd.DELETE_USER)
    async remove(@Payload() id: number) {
        return await this.usersService.remove(id);
    }
}
