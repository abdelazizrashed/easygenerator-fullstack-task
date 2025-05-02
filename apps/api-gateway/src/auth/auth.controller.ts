import { Body, Controller, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.response.dto';
import { SingupRequestDto } from './dto/signup.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { throws } from 'assert';


@ApiTags("Auth")
@Controller('auth')
export class AuthController {


    @Post("signup")
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: SingupRequestDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: "User created successfully", type: AuthResponseDto })
    @ApiBadRequestResponse({ description: "Invalid input data (validation failed)" })
    @ApiConflictResponse({ description: "Email already exists" })
    async signUp(@Body() signupDto: SingupRequestDto): Promise<AuthResponseDto> {
        await new Promise(resolve => setTimeout(resolve, 1400));
        return {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            user: {
                id: "9928jfklvjewioduf90",
                name: signupDto.name,
                email: signupDto.email,
            }
        };
    }

    @Post("login")
    @ApiOperation({ summary: "Login a user" })
    @ApiBody({ type: LoginRequestDto })
    @ApiResponse({ status: HttpStatus.OK, description: "User logged in successfully", type: AuthResponseDto })
    @ApiBadRequestResponse({ description: "Invalid input data (validation failed)" })
    @ApiUnauthorizedResponse({ description: "Invalid credentials" })
    async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
        await new Promise(resolve => setTimeout(resolve, 1400));
        return {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            user: {
                id: "9928jfklvjewioduf90",
                name: "John Doe",
                email: loginDto.email,
            }
        };
    }
}
