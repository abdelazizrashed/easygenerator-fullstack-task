import { USER_SERVICE, UserCmd } from '@app/common';
import { UserWithPassDto } from '@app/common/user/dto/user-with-pass.dto';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { AuthResponseDto } from 'apps/api-gateway/src/auth/dto/auth.response.dto';
import { LoginRequestDto } from 'apps/api-gateway/src/auth/dto/login.request.dto';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthServiceService {
    private readonly logger = new Logger(AuthServiceService.name);
    private readonly requestTimeout = 5000;

    constructor(
        @Inject(USER_SERVICE.token) private readonly userClient: ClientProxy,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(credentials: LoginRequestDto): Promise<UserWithPassDto> {
        const { email, password } = credentials;
        this.logger.log(`Validating user: ${email}`);

        const user = await firstValueFrom(
            this.userClient
                .send<UserWithPassDto | null>(
                    UserCmd.GET_USER_BY_EMAIL_FOR_AUTH,
                    email,
                )
                .pipe(timeout(this.requestTimeout)),
        );

        if (!user) {
            this.logger.warn(`Validation failed: User ${email} not found.`);
            throw new NotFoundException(`User ${email} not found.`);
        }

        const isPasswordMatching = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordMatching) {
            this.logger.warn(
                `Validation failed: Invalid password for user ${email}.`,
            );
            throw new UnauthorizedException(
                'Invalid credentials - password mismatch',
            );
        }

        this.logger.log(`User validation successful: ${email}`);
        return user;
    }

    async login(user: UserWithPassDto): Promise<AuthResponseDto> {
        this.logger.log(`Generating JWT for user: ${user.email}`);
        const payload = {
            email: user.email,
            sub: user.id,
        };
        try {
            const token = await this.jwtService.signAsync(payload);
            this.logger.log(`JWT generated successfully for ${user.email}`);
            return {
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            };
        } catch (error) {
            this.logger.error(
                `JWT signing failed for ${user.email}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                'Could not generate authentication token.',
            );
        }
    }

    async validateToken(token: string): Promise<any> {
        this.logger.log('Validating incoming JWT');
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            this.logger.log(
                `JWT validation successful for sub: ${payload.sub}`,
            );
            return payload;
        } catch (error) {
            this.logger.warn(`JWT validation failed: ${error.message}`);
            if (error?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            if (error?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            }
            throw new UnauthorizedException('Token validation failed');
        }
    }
}
