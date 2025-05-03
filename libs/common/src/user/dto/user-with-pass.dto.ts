import { UserDto } from './user.dto';

export class UserWithPassDto {
    constructor(partial: Partial<UserWithPassDto>) {
        Object.assign(this, partial);
    }

    id: string;
    name: string;
    email: string;
    passwordHash: string;

    toUserDto(): UserDto {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}
