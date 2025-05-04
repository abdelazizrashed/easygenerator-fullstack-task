import { Controller, Logger } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthCmd } from '@app/common';
import { LoginRequestDto } from 'apps/api-gateway/src/auth/dto/login.request.dto';
import { AuthResponseDto } from 'apps/api-gateway/src/auth/dto/auth.response.dto';

@Controller()
export class AuthServiceController {
    private readonly logger = new Logger(AuthServiceController.name);

    constructor(private readonly authService: AuthServiceService) {}

    @MessagePattern(AuthCmd.VALIDATE_USER)
    async validateUserAndLogin(
        @Payload() loginDto: LoginRequestDto,
    ): Promise<AuthResponseDto> {
        const validatedUser = await this.authService.validateUser(loginDto);
        return await this.authService.login(validatedUser);
    }

    @MessagePattern(AuthCmd.VALIDATE_TOKEN)
    async validateToken(@Payload() token: string): Promise<any> {
        this.logger.log(`Received ${AuthCmd.VALIDATE_TOKEN}`);
        return await this.authService.validateToken(token);
    }
}
