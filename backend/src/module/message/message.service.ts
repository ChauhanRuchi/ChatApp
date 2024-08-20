import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SqlserviceService } from 'src/service/sqlService';
import { TableName } from 'src/common/app.constants';
import { MessageQueries } from './message.query';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessageService {
  constructor(
    private sqlService: SqlserviceService,
    private messageQueries: MessageQueries,
    private notificationsService: NotificationsService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
  console.log("======= createMessageDto =======\n", createMessageDto);
    try {
      let messageKeys = Object.keys(createMessageDto);
      let messageValues = Object.values(createMessageDto);

      let data = await this.sqlService.run(
        this.messageQueries.insertData(
          TableName.Table_Messages,
          messageKeys.join(','),
        ),
        messageValues,
      );
      let res = await this.notificationsService.create({
        message_id: data?.insertId,
        sender_id: createMessageDto?.sender_id,
        message: createMessageDto?.content,
        status: 'pending',
        isRead: false
      });
      

      return {
        message: 'Message created successfully',
        statusCode: 201,
        data: {
          ...createMessageDto,
          message_id: data?.insertId,
        },
      };
    } catch (error) {
    console.log("======= error =======\n", error);
      throw error
    }
  }

  findAll() {
    return `This action returns all message`;
  }

  async findOne(id: number) {
    try {
      let data = await this.sqlService.run(
        this.messageQueries.findMessage(TableName.Table_Messages, id),
      );

      return {
        message: 'return the message data',
        data: data,
        statusCode: 200,
      };
    } catch (error) {
      throw error

    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      let res = await this.sqlService.run(
        this.messageQueries.findUpdateStatus(TableName.Table_Messages, id),
      );
  
      // Iterate over each item in the array and update them
      for (let item of res) {
        delete item?.created_date;
        delete item?.updated_date;
  
        let updatedData = {
          status: updateMessageDto?.status || item?.status,
        };
  
        const updatePairs = Object.keys(updatedData).map(
          (key) => `${updatedData[key]}`,
        );
  
        // Apply the update for each item
       let res= await this.sqlService.run(
          this.messageQueries.updateData(TableName.Table_Messages, item.sender_id),
          updatePairs,
        );
        console.log("updatechateee",res)
      }
      return {
        stausCode:200,
        data:updateMessageDto
      }
    } catch (error) {
      throw error
    }
  }
  
  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
