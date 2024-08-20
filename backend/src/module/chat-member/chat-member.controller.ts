import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ChatMemberService } from './chat-member.service';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { UpdateChatMemberDto } from './dto/update-chat-member.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('chat-member')
export class ChatMemberController {
  constructor(private readonly chatMemberService: ChatMemberService) {}

  
  @Post()
  create(@Body() createChatMemberDto: CreateChatMemberDto) {
    return this.chatMemberService.create(createChatMemberDto);
  }

  @Get()
  findAll() {
    return this.chatMemberService.findAll();
  }

  @Get(':firstId/:secoundId')
  findOne(@Param('firstId') firstId: string,@Param('secoundId') secoundId: string) {
    return this.chatMemberService.findOne(+firstId,+secoundId);
  }

  @Get('/findUserChat')
  findUserChat(@Request() req:any) {

    return this.chatMemberService.findUserChat(req['user']);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatMemberDto: UpdateChatMemberDto) {
    return this.chatMemberService.update(+id, updateChatMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatMemberService.remove(+id);
  }
}
