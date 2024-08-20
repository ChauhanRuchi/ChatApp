import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { SqlserviceService } from './service/sqlService';
import { UserModule } from './module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmAsyncOptions } from './service/TypeOrmConfig';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatGateway } from './Gateway';
import { ChatMemberModule } from './module/chat-member/chat-member.module';
import { MessageModule } from './module/message/message.module';
import { NotificationsModule } from './module/notifications/notifications.module';
import { UploadsModule } from './module/uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmAsyncOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    UploadsModule,
    NotificationsModule,
    JwtModule.register({
      global: true,
      secret: 'asdfghjkljkl',
      signOptions: { expiresIn: '3600s' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.NODE_EMAILER_HOST,
          port: process.env.NODE_EMAILER_PORT,
          secure: 'STARTTLS',
          auth: {
            user: process.env.NODE_EMAILER_USER,
            pass: process.env.NODE_EMAILER_PASSWORD,
          },
        },
        defaults: {
          from: process.env.NODE_EMAILER_FROM_EMAIL,
        },
        template: {
          dir: process.cwd() + '/template/emails/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    ChatMemberModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqlserviceService, ChatGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'user/update-profile',
        method: RequestMethod.POST,
      },
      {
        path: 'chat-member/*',
        method: RequestMethod.ALL,
      },
      {
        path: 'message/*',
        method: RequestMethod.ALL,
      },
    );
  }
}
