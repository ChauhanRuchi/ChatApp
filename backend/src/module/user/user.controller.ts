import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards, Req, Res} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ConfirmOtp } from './dto/otp.dto';
import { SmsService } from 'src/service/sms.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly smsService: SmsService
  ) {}

  @Post("/register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("/login")
  login(@Body() createUserDto: LoginUserDto) {
    return this.userService.login(createUserDto);
  }

  @Post("/forgot-password")
  forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPassword);
  }

  @Post("/confirm-otp")
  confirmOtp(@Body() confirOtp: ConfirmOtp) {
    return this.userService.confirmOtp(confirOtp);
  }

  @Post("/reset-password")
  resetPassword(@Body() confirOtp: ConfirmOtp) {
    return this.userService.confirmOtp(confirOtp);
  }

  @Post("/update-profile")
  updateProfile(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(updateUserDto);
  }

  @Post('send-otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP
    const customizedMessage = `${otp}`; // Customize the message by appending the OTP

    await this.smsService.sendOtp('+91 8469064302', customizedMessage);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {
  console.log("======= req =======\n", req.body);
    return req.body
    // Initiates the Google OAuth2 login process
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: any, @Res() res: any) {
    // Handle the callback from Google and redirect to frontend or return user data
    const user = req.user;
    console.log("======= user =======\n", user);
    // Redirect or respond with user data
    res.send('http://localhost:3000/api/user/google/callback'); // Redirect to your frontend
  }

}
