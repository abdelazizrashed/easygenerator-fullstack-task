import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_SERVICE, createClientsAsyncOptions, USER_SERVICE } from '@app/common';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/api-gateway/.env',
        }),
        AuthModule,
        ClientsModule.registerAsync([
            createClientsAsyncOptions(AUTH_SERVICE),
            createClientsAsyncOptions(USER_SERVICE),
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
