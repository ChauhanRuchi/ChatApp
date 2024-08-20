import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordDto {
  // @ApiProperty({
  //   example:"123456",
  //   description:'password',
  //  })
  //  old_password:string='123456'

  //  @ApiProperty({
  //   example:"123456",
  //   description:'password',
  //  })
  //  password:string='123456'
}
