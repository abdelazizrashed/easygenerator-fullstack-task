import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/user-service/.env',
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService) => ({
                uri: configService.get('USER_SERVICE_MONGO_URI'),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
})
export class UserServiceModule {}
