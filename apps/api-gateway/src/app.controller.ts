import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
    @Get('/health')
    @HttpCode(HttpStatus.OK)
    health() {
        return { status: 'ok' };
    }

    @Get('/')
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get welcome message (Protected Route)' })
    @ApiOkResponse({ description: 'Welcome message for authenticated users.', schema: { example: { status: 'ok', message: 'Welcome to the application' } } })
    @ApiUnauthorizedResponse({ description: 'Unauthorized - Missing or invalid JWT' })
    root() {
        return {
            status: 'ok',
            message: 'Welcome to the app',
        };
    }
}
