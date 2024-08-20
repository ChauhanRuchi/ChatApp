import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from "class-validator";
  import { User } from "../entities/user.entity";
  import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
  export class UpdateUserDto extends User {
 
    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({
      example: "ruchi",
      description: "Username",
    })
    user_name: string = "ruchi";

    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({
      example: "ruchi",
      description: "Username",
    })
    full_name: string = "ruchi";

    @IsNotEmpty()
    @IsString()
    @MinLength(12, {
      message: "Mobile number is too short. Minimum length is $constraint1 characters.",
    })
    @MaxLength(14, {
      message: "Mobile number is too short. Maximum length is $constraint1 characters.",
    })
    @ApiPropertyOptional({
      example: "+919079463696",
      description: "Phone number of a user",
    })
    mobile_number: string = "+919079463696";
  
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiPropertyOptional({
      example: "test@test.com",
      description: "Email address to be registered",
    })
    email: string = "test@test.com";
  }
  