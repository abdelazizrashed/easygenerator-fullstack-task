import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: "User's id in database",
    example: '9928jfklvjewioduf90',
  })
  id: string;

  @ApiProperty({
    description: "User's name",
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john@doe.com',
  })
  email: string;
}
