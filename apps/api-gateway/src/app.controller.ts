import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';



@Controller()
export class AppController {


    constructor(
        private readonly appService: AppService,
    ) { }

    @Get('/health')
    @HttpCode(HttpStatus.OK)
    health() {
        return { status: 'ok' };
    }

    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get welcome message (Protected Route)' })
    @ApiOkResponse({
        description: 'Welcome message for authenticated users.',
        schema: {
            example: { status: 'ok', message: 'Welcome to the application' },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Missing or invalid JWT',
    })
    root(
        @Req() req: Request,
    ) {
        const { userId } = (req as any).user;
        const token = (req as any).headers.authorization.split(' ')[1];
        return this.appService.getWelcomeMessage(userId, token);
    }
}
