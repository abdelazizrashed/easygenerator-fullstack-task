import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SingupRequestDto {
    @ApiProperty({
        minLength: 3,
        description: "User's name (minimum 3 characters)",
        example: "John Doe",
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: "Name must be at least 3 characters" })
    name: string;

    @ApiProperty({
        example: "john@doe.com",
        description: "User's email address"
    })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "User's login password",
        example: "Pass@123",
        minLength: 8,
        pattern: "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$", // Used Codeium code completion to generate this
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' })
    password: string;
}
