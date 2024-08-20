import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsQueries } from './notifications.query';
import { SqlserviceService } from 'src/service/sqlService';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService,NotificationsQueries,SqlserviceService],
})
export class NotificationsModule {}
