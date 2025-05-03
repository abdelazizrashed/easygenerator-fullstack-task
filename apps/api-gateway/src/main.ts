import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcToHttpExceptionFilter } from '@app/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors();

    // *************** Swagger Setup [START] ***************
    const config = new DocumentBuilder()
        .setTitle('Easy Generator Auth API')
        .setDescription(
            'API Documentation for Fullstack Test Task user auth module.',
        )
        .setVersion('1.0')
        .addTag('Auth', 'Authentication related endpoints')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    // *************** Swagger Setup [END] ***************

    app.useGlobalFilters(new RpcToHttpExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
