import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
    AUTH_SERVICE,
    createMicroserviceOptions,
    HttpToRpcExceptionFilter,
} from '@app/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
    const logger = new Logger('AuthService');
    const options = createMicroserviceOptions(AUTH_SERVICE, process.env);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AuthServiceModule,
        options,
    );
    app.useGlobalFilters(new HttpToRpcExceptionFilter());
    await app.listen();
    logger.log(
        `AuthService is listening on port ${process.env.AUTH_SERVICE_PORT}`,
    );
}
bootstrap();
