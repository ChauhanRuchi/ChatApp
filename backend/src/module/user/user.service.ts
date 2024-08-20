import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SqlserviceService } from 'src/service/sqlService';
import { comparePassword, generateOTP, generateRefreshToken, getSecurePassword, TableName } from 'src/common/app.constants';
import { UsersQueries } from './user.query';
import { error } from 'console';
import * as _ from 'lodash'
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { NodeMailerService } from 'src/nodemailer';
import { ConfirmOtp } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly sqlService: SqlserviceService,
    private readonly userQueries: UsersQueries,
    private jwtService: JwtService,
    private readonly mailService: NodeMailerService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Users, createUserDto?.email))
      if (!res) {
        let userArr = ['user_name', 'full_name', 'email', 'mobile_number', 'password']
        let hashPassword = await getSecurePassword(createUserDto?.password)
        createUserDto = { ...createUserDto, password: hashPassword }
        let userArray = _.pick(createUserDto, userArr)
        console.log("hahspassss", userArray)

        let userKeys = Object.keys(userArray)
        let userValues = Object.values(userArray)

        let data = await this.sqlService.run(this.userQueries.insertData(TableName.Table_Users, userKeys.join(",")), userValues)
        let res = await this.updateDevice(data?.insertId, createUserDto)
      let  access_token=res?.access_token
      let  refresh_token=res?.refresh_token

        return{
          message:"user created successfully",
          statusCode:201,
          data:{
            ...createUserDto,
            access_token,
            refresh_token,
            user_id:data?.insertId
          }
        }      }
      else {
        throw error('user register already')
      }
    } catch (error) {
      console.log("......error", error)
      throw error
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      let access_token
      let refresh_token
      let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Users, loginUserDto?.email))
      if (res) {
        let comPassword = await comparePassword(loginUserDto?.password, res?.password)
        if (comPassword) {
          let data:any=await this.updateDevice(res?.user_id, loginUserDto)
          access_token=data?.access_token
          refresh_token=data?.refresh_token

        }
        else {
          return{
            message:"password does not match",
            statusCode:400,
            
          }}
      }
      else {
        throw new HttpException('user does not exit', 400)
      }
      return{
        message:"user login successfully",
        statusCode:200,
        data:{
          ...loginUserDto,
          access_token,
        refresh_token,
          ...res,
          user_id:res?.user_id
        }
      }
    } catch (error) {
      throw error

    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Users, forgotPasswordDto?.email))
      if (res) {
        let otp = generateOTP()
        var otp_access_token = await this.jwtService.signAsync({email:forgotPasswordDto?.email});

        let otpArr = [
          'otp',
          'email',
          'expiry_time',
          'otp_access_token'
        ]
        let now = new Date();

        let futureTime = new Date(now.getTime() + 20 * 60000);
        let otpArray = _.pick({ ...forgotPasswordDto, otp: otp, expiry_time: futureTime,otp_access_token }, otpArr)
        console.log("hahspassss", otpArray)

        let otpKeys = Object.keys(otpArray)
        let otpValues = Object.values(otpArray)

        let data = await this.sqlService.run(this.userQueries.insertDataOtp(TableName.Table_Otp, otpKeys.join(",")), otpValues)


        await this.mailService.sendEmail(
          'Palminfotech Apps <noreply.palminfotech@gmail.com>',
          forgotPasswordDto.email,
          'Forgot Password Email Verification',
          './forgotpassword',
          {
            // Data to be sent to template engine.
            email: forgotPasswordDto.email,
            OTP: otp,
          },

        )

      }
      else {

        throw error('user not register')

      }


    } catch (error) {
      console.log("error..........", error)

    }
  }

  async confirmOtp(confirmOtp: ConfirmOtp) {
    try {
      let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Otp, confirmOtp?.email))
      if (res) {
        let now = new Date();
        console.log(".....")
        if (now > res?.expiry_time) {
          console.log("otp is expiry")
          return "otp is expiry"
        }
        else {

          if (res?.otp === confirmOtp?.otp) {
            console.log("otp is expiry")

            return "match ..."

          }
          else {
            console.log("invalid otp")

            return "invalid otp"

          }
        }




      }
      else {
        console.log("user does not exit")

        return "user does not exit"
      }

    } catch (error) {
      console.log(".......errrrr", error)

    }
  }

  async resetPassword(confirmOtp: ResetPasswordDto) {
    // try {
    //   let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Otp, confirmOtp?.email))
    //   if (res) {
    //     let now = new Date();
    //     console.log(".....")
    //     if (now > res?.expiry_time) {
    //       console.log("otp is expiry")
    //       return "otp is expiry"
    //     }
    //     else {

    //       if (res?.otp === confirmOtp?.otp) {
    //         console.log("otp is expiry")

    //         return "match ..."

    //       }
    //       else {
    //         console.log("invalid otp")

    //         return "invalid otp"

    //       }
    //     }




    //   }
    //   else {
    //     console.log("user does not exit")

    //     return "user does not exit"
    //   }

    // } catch (error) {
    //   console.log(".......errrrr", error)

    // }
  }

  async updateProfile(updateDto: UpdateUserDto) {
    try {
      let res = await this.sqlService.run(this.userQueries.findOne(TableName.Table_Users, updateDto?.email))

      console.log("......", res)
      delete res?.created_date
      delete res?.updated_date

      let updatedData = {
        user_name:
          updateDto?.user_name || res?.user_name,
        full_name:
          updateDto?.full_name ||
          res?.full_name,
        mobile_number: updateDto?.mobile_number || res?.mobile_number,

      }
      const updatePairs = Object.keys(updatedData).map(
        (key) => `${updatedData[key]}`,
      )

      let data = await this.sqlService.run(this.userQueries.updateData(TableName.Table_Users, res?.user_id), updatePairs)

    } catch (error) {
      console.log("...................", error)

    }
  }

  async findAll() {
    try {
      let res=await this.sqlService.run(this.userQueries.findAll(TableName.Table_Users))
      return{
        message:'return the all user',
        data:res,
        statusCode:200
      }
    } catch (error) {

    }  }

  async findOne(id: number) {
    try {
      let res=await this.sqlService.run(this.userQueries.findOneUser(TableName.Table_Users,id))
      return{
        message:'return the all user',
        data:res,
        statusCode:200
      }
    } catch (error) {

    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  async updateDevice(user_id, createUserDto) {
    console.log("createuserdto...", createUserDto)

    let payload = {
      user_id: user_id,
      email: createUserDto?.email
    }
    let userSessionArr = ['device_name', 'access_token', 'refresh_token', 'user_id']
    let refreshtoken = await generateRefreshToken(10)
    var access_token = await this.jwtService.signAsync(payload);

    let userSession = _.pick({ device_name: createUserDto?.device_name, access_token: access_token, refresh_token: refreshtoken, user_id: user_id }, userSessionArr)
    let userSessionKeys = Object.keys(userSession)
    let userSessionValues = Object.values(userSession)
    let data = await this.sqlService.run(this.userQueries.insertDataDevice(TableName.Table_Session, userSessionKeys.join(",")), userSessionValues)
    return{
      access_token:access_token,
      refresh_token:refreshtoken
    }

  }

}
