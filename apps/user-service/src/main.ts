import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { createMicroserviceOptions, USER_SERVICE } from '@app/common';
import { HttpToRpcExceptionFilter } from '@app/common/filters/http-to-rpc.exception.filter';

async function bootstrap() {
    const logger = new Logger('UserService');
    const options = createMicroserviceOptions(USER_SERVICE, process.env);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        UserServiceModule,
        options,
    );
    app.useGlobalFilters(new HttpToRpcExceptionFilter());
    await app.listen();
    logger.log(`UserService is listening on port ${process.env.USER_SERVICE_PORT}`);
}
bootstrap();
