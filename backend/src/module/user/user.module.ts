import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersQueries } from './user.query';
import { SqlserviceService } from 'src/service/sqlService';
import { NodeMailerService } from 'src/nodemailer';
import { SmsService } from 'src/service/sms.service';
import { GoogleStrategy } from 'src/service/google.strategy';
import { OtpMiddleware } from 'src/middleware/otp.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService,UsersQueries,SqlserviceService,NodeMailerService,SmsService,GoogleStrategy],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OtpMiddleware).forRoutes({
      path: "user/reset-password",
      method: RequestMethod.POST,
    });
  }
}
