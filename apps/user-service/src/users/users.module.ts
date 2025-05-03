import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPersistenceModel, UserSchema } from './entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserPersistenceModel.name, schema: UserSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
