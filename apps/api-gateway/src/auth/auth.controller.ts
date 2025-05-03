import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConflictResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.response.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { CreateUserDto } from '@app/common/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
        type: AuthResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data (validation failed)',
    })
    @ApiConflictResponse({ description: 'Email already exists' })
    async signUp(@Body() signupDto: CreateUserDto): Promise<AuthResponseDto> {
        return await this.authService.register(signupDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginRequestDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User logged in successfully',
        type: AuthResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data (validation failed)',
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
        return await this.authService.login(loginDto);
    }
}
