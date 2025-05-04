import {
    AUTH_SERVICE,
    AuthCmd,
    CreateUserDto,
    USER_SERVICE,
    UserCmd,
    UserDto,
} from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { LoginRequestDto } from './dto/login.request.dto';
import { AuthResponseDto } from './dto/auth.response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
    private readonly logger = new Logger(AuthService.name);
    private readonly requestTimeout = 5000; // 5 seconds

    constructor(
        @Inject(USER_SERVICE.token) private readonly userClient: ClientProxy,
        @Inject(AUTH_SERVICE.token) private readonly authClient: ClientProxy,
    ) { }

    async onModuleInit() {
        try {
            await Promise.all([
                this.userClient.connect(),
                this.authClient.connect(),
            ]);
            this.logger.log('Auth & User Service Clients Connected');
        } catch (error) {
            this.logger.error('Failed to connect to microservices', error);
        }
    }

    async register(signupDto: CreateUserDto): Promise<AuthResponseDto> {
        const user = await firstValueFrom(
            this.userClient.send<UserDto>(UserCmd.CREATE_USER, signupDto).pipe(
                timeout(this.requestTimeout),
                catchError((err) => throwError(() => new RpcException(err))),
            ),
        );
        const authResponse = await firstValueFrom(
            this.authClient
                .send<AuthResponseDto>(AuthCmd.VALIDATE_USER, {
                    email: user.email,
                    password: signupDto.password,
                })
                .pipe(timeout(this.requestTimeout)),
        );
        return authResponse;
    }

    async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
        this.logger.log(
            `Forwarding login for ${loginDto.email} to Auth Service`,
        );
        const authResponse = await firstValueFrom(
            this.authClient
                .send<AuthResponseDto>(AuthCmd.VALIDATE_USER, loginDto)
                .pipe(
                    timeout(this.requestTimeout),
                    catchError((err) =>
                        throwError(() => new RpcException(err)),
                    ),
                ),
        );
        return authResponse;
    }
}
