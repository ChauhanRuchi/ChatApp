import { Injectable } from '@nestjs/common';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { UpdateChatMemberDto } from './dto/update-chat-member.dto';
import { SqlserviceService } from 'src/service/sqlService';
import { ChatMemberQueries } from './chat-member.query';
import { TableName } from 'src/common/app.constants';
import { ChatGateway } from 'src/Gateway';

@Injectable()
export class ChatMemberService {
  constructor(
    private sqlService: SqlserviceService,
    private chatQueries: ChatMemberQueries,
    private chatGateway:ChatGateway
  ) { }
  async create(createChatMemberDto: CreateChatMemberDto) {

    try {
      let res = await this.sqlService.run(this.chatQueries.findOne(TableName.Table_ChatMember, [createChatMemberDto?.firstId, createChatMemberDto?.secoundId]))
      if (res) {
        return {
          message: "return the  chat",
          statusCode: 200,
          data: res
        }
      }
      else {
        let chatData = { members: [createChatMemberDto?.firstId, createChatMemberDto?.secoundId] }
        let chatKeys = Object.keys(chatData)
        let chatValues = Object.values(chatData)
        console.log("chatatt",chatKeys,chatValues)

        let data = await this.sqlService.run(this.chatQueries.insertData(TableName.Table_ChatMember, chatKeys.join(",")), JSON.stringify(chatValues[0]))
        return {
          message: "chat created successfully",
          statusCode: 201,
          data: {members:[createChatMemberDto?.firstId,createChatMemberDto?.secoundId],id:data?.insertId}

        }
      }
     
    }

    catch (error) {
      throw error
    }
  }

  findAll() {
    try {
      let data = this.sqlService.run(this.chatQueries.findAll(TableName.Table_ChatMember))
      return {
        message: 'return the all data',
        data: data,
        statusCode: 200
      }
    } catch (error) {
      throw error

    }
  }

  findOne(firstId: number, secoundId: number) {
    try {
      let data = this.sqlService.run(this.chatQueries.findOne(TableName.Table_ChatMember, [firstId, secoundId]))
      return {
        message: 'return the all data',
        data: data,
        statusCode: 200
      }
    } catch (error) {
      throw error

    }
  }

  
 async findUserChat(user:any) {
    try {
      let data =await this.sqlService.run(this.chatQueries.findUserChat(TableName.Table_ChatMember, user?.user_id))
      // this.chatGateway.server.emit('updateChatList', data);

      return {
        message: 'return the all data',
        data: data,
        statusCode: 200
      }
    } catch (error) {
      throw error
    }

  }

  update(id: number, updateChatMemberDto: UpdateChatMemberDto) {
    return `This action updates a #${id} chatMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMember`;
  }
}
