import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SqlserviceService } from 'src/service/sqlService';
import { MessageQueries } from './message.query';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsQueries } from '../notifications/notifications.query';

@Module({
  controllers: [MessageController],
  providers: [MessageService,SqlserviceService,MessageQueries,NotificationsService,NotificationsQueries],
})
export class MessageModule {}
