import { AUTH_SERVICE, AuthCmd, USER_SERVICE, UserCmd, UserDto } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppService {
    private readonly requestTimeout = 5000;

    constructor(
        @Inject(USER_SERVICE.token) private readonly userClient: ClientProxy,
        @Inject(AUTH_SERVICE.token) private readonly authClient: ClientProxy,
    ) { }


    async getWelcomeMessage(userId: string, token: string): Promise<any> {

        // Author: Abdelaziz Rashed @ 2025/05/04
        // This doesn't service a purpose here as [@UseGuards(AuthGuard('jwt'))] handles the validation or the token.
        // This could be used to check for the token blacklist.
        // This throws it's correct http error so no error checking is needed here.
        const payload = await firstValueFrom(
            this.authClient.send<any>(
                AuthCmd.VALIDATE_TOKEN,
                token
            ).pipe(timeout(this.requestTimeout))
        );

        const user = await firstValueFrom(
            this.userClient
                .send<UserDto>(
                    UserCmd.GET_USER,
                    userId,
                )
                .pipe(timeout(this.requestTimeout)),
        );

        // I am returning any because I am tired and I want to submit this task :').
        return {
            status: "ok",
            message: `Welcome to the application from the backend, ${user.name}!`,
            data: user,
        }
    }
}
