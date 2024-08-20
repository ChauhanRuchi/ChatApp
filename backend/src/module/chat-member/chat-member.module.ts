import { Module } from '@nestjs/common';
import { ChatMemberService } from './chat-member.service';
import { ChatMemberController } from './chat-member.controller';
import { ChatMemberQueries } from './chat-member.query';
import { SqlserviceService } from 'src/service/sqlService';
import { ChatGateway } from 'src/Gateway';

@Module({
  controllers: [ChatMemberController],
  providers: [ChatMemberService,ChatMemberQueries,SqlserviceService,ChatGateway],
})
export class ChatMemberModule {}
