import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: "test@test.com",
    description: "Email address to be registered",
  })
  email: string = "test@test.com";

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: "Password is too short. Minimal length is $constraint1 characters.",
  })
  @ApiProperty({
    example: "12345678",
    description: "Password required to be use later while login in app",
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "abc",
    description: "device namw",
  })
  device_name: string = "vcc";

}
