import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
  } from "class-validator";
  import { User } from "../entities/user.entity";
  import { ApiProperty } from "@nestjs/swagger";
  export class CreateUserDto extends User {
    @IsNotEmpty()
    @IsString()
    @MinLength(2, {
      message: "User name is too short. Minimal length is $constraint1 characters.",
    })
    @MaxLength(30, {
      message: "User name is too long. Maximal length is $constraint1 characters.",
    })
    @ApiProperty({ example: "test", description: "Name of user" })
    full_name: string = "test";
  
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
      example: "ruchi",
      description: "Username",
    })
    user_name: string = "ruchi";

    @IsNotEmpty()
    @IsString()
    @MinLength(12, {
      message: "Mobile number is too short. Minimum length is $constraint1 characters.",
    })
    @MaxLength(14, {
      message: "Mobile number is too short. Maximum length is $constraint1 characters.",
    })
    @ApiProperty({
      example: "+919079463696",
      description: "Phone number of a user",
    })
    mobile_number: string = "+919079463696";
  
   @ApiProperty({
    example:"123456",
    description:'password',
   })
   password:string='123456'

   
   @ApiProperty({
    example:"abc",
    description:'device name',
   })
   device_name:string='abc'
  }
  