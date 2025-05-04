import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/common/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserPersistenceModel } from './entities/user.entity';
import { Model, FilterQuery } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '@app/common/user/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { PaginationQueryDto } from '@app/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '@app/common/dto/paginated_response.dto';
import { PageMetaDto } from '@app/common/dto/page-meta.dto';
import { UserWithPassDto } from '@app/common/user/dto/user-with-pass.dto';

@Injectable()
export class UsersService {
    private readonly saltRounds: number;

    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(UserPersistenceModel.name)
        private userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
    ) {
        this.saltRounds = parseInt(
            this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'),
            10,
        );
    }

    private mapToUserDto(userDoc: UserDocument): UserDto {
        return {
            id: userDoc._id.toString(),
            name: userDoc.name,
            email: userDoc.email,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const { name, email, password } = createUserDto;
        let hashedPassword: string;
        try {
            hashedPassword = await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            this.logger.error('Password hashing failed', error);
            throw new RpcException(
                new InternalServerErrorException(
                    "Couldn't create a user record",
                ),
            );
        }
        const newUser = new this.userModel({
            name,
            email,
            passwordHash: hashedPassword,
        });
        try {
            const savedUser = await newUser.save();
            return this.mapToUserDto(savedUser);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                throw new ConflictException('Email already exists');
            }
            this.logger.error('User creation failed: ', error);
            throw new InternalServerErrorException(
                "Couldn't create a user record",
            );
        }
    }

    async findAll(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserDto>> {
        try {
            const { page = 1, limit = 10, skip } = paginationQuery;
            const [itemCount, users] = await Promise.all([
                this.userModel.countDocuments().exec(),
                this.userModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .select('-passwordHash')
                    .lean()
                    .exec(),
            ]);
            const mappedUsers = users.map((user: UserDocument) => this.mapToUserDto(user));
            return new PaginatedResponseDto(
                mappedUsers,
                new PageMetaDto(itemCount, mappedUsers.length, limit, page),
            );
        } catch (error) {
            this.logger.error('User creation failed: ', error);
            throw new InternalServerErrorException(
                "Couldn't create a user record",
            );
        }
    }

    async findOne(id: string): Promise<UserDto> {
        let userDoc: UserDocument | null;
        try {
            userDoc = await this.userModel
                .findById(id)
                .select('-passwordHash')
                .lean()
                .exec();
        } catch (error) {
            this.logger.error(
                `Error finding user by ID ${JSON.stringify(id)}: ${error}`,
                error.stack,
            );
            if (error.name === 'CastError') {
                throw new BadRequestException(`Invalid user ID format: ${id}`);
            }
            throw new InternalServerErrorException(
                `Error finding user by ID ${id}`,
            );
        }

        if (!userDoc) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.mapToUserDto(userDoc);
    }

    async findOneByEmailForAuth(
        email: string,
    ): Promise<UserWithPassDto | null> {
        let user: UserDocument | null;
        try {
            user = await this.userModel
                .findOne({ email })
                .select('+passwordHash')
                .lean()
                .exec();
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                'Database error during email lookup.',
            );
        }
        if (!user) {
            this.logger.warn(
                `User with Email ${email} not found during update.`,
            );
            throw new NotFoundException(
                `User with Email ${email} not found during update.`,
            );
        }
        return new UserWithPassDto({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const updateData: Partial<UserPersistenceModel> = {};

        if (updateUserDto.name !== undefined)
            updateData.name = updateUserDto.name;
        if (updateUserDto.email !== undefined)
            updateData.email = updateUserDto.email;

        if (updateUserDto.password) {
            try {
                updateData.passwordHash = await bcrypt.hash(
                    updateUserDto.password,
                    this.saltRounds,
                );
            } catch (error) {
                this.logger.error(
                    'Password hashing failed during update',
                    error.stack,
                );
                throw new InternalServerErrorException(
                    "Couldn't process user update request.",
                );
            }
        }

        if (Object.keys(updateData).length === 0) {
            return this.findOne(id);
        }

        let updatedUserDoc: UserDocument | null;
        try {
            updatedUserDoc = await this.userModel
                .findByIdAndUpdate(id, { $set: updateData }, { new: true })
                .select('-passwordHash')
                .lean()
                .exec();
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                this.logger.warn(
                    `Attempt to update user ${id} with existing email: ${updateUserDto.email}`,
                );
                throw new ConflictException(
                    `Email ${updateUserDto.email} is already in use.`,
                );
            }
            this.logger.error(
                `Failed to update user ${id}: ${error}`,
                error.stack,
            );
            if (error.name === 'CastError') {
                throw new BadRequestException(
                    `Invalid user ID format for update: ${id}`,
                );
            }
            throw new InternalServerErrorException(
                "Couldn't process user update request.",
            );
        }

        if (!updatedUserDoc) {
            this.logger.warn(`User with ID ${id} not found during update.`);
            throw new NotFoundException(
                `User with ID ${id} not found during update.`,
            );
        }
        return this.mapToUserDto(updatedUserDoc);
    }

    async remove(id: number) {
        let result: UserDocument | null;
        try {
            result = await this.userModel.findByIdAndDelete(id).exec();
        } catch (error) {
            this.logger.error(
                `Failed to delete user ${id}: ${error}`,
                error.stack,
            );
            if (error.name === 'CastError') {
                throw new BadRequestException(
                    `Invalid user ID format for delete: ${id}`,
                );
            }
            throw new InternalServerErrorException(
                "Couldn't process user delete request.",
            );
        }

        if (!result) {
            this.logger.warn(`User with ID ${id} not found for deletion.`);
            throw new NotFoundException(
                `User with ID ${id} not found for deletion.`,
            );
        }
        this.logger.log(`User deleted successfully: ID ${id}`);
    }
}
