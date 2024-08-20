import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ConfirmOtp {
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
  @ApiProperty({
    example: "789456",
    description: "Email address to be registered",
  })
  otp: string = "789456";

}