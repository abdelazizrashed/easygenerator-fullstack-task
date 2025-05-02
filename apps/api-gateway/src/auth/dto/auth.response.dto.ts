import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class AuthResponseDto {
    @ApiProperty({
        description: "JWT Access token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    })
    token: string;

    @ApiProperty({
        description: "Logged in user details",
        type: UserDto
    })
    user?: UserDto;
}
