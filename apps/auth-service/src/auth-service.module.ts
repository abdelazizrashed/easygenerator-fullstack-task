import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';
import { ClientsModule } from '@nestjs/microservices';
import { createClientsAsyncOptions, USER_SERVICE } from '@app/common';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/auth-service/.env',
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig,
        }),
        ClientsModule.registerAsync([createClientsAsyncOptions(USER_SERVICE)]),
    ],
    controllers: [AuthServiceController],
    providers: [AuthServiceService, JwtStrategy],
    exports: [AuthServiceService],
})
export class AuthServiceModule { }
