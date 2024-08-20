import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsQueries } from './notifications.query';
import { SqlserviceService } from 'src/service/sqlService';
import { TableName } from 'src/common/app.constants';

@Injectable()
export class NotificationsService {
  constructor(
    private sqlService: SqlserviceService,
    private notificationquery: NotificationsQueries,
  ) { }
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      let notificationKeys = Object.keys(createNotificationDto);
      let notificationValues = Object.values(createNotificationDto);
      console.log('chatatt', notificationKeys, notificationValues);

      let data = await this.sqlService.run(
        this.notificationquery.insertData(
          TableName.Table_Notifications,
          notificationKeys.join(','),
        ),
        notificationValues,
      );
      return {
        message: 'chat notification successfully',
        statusCode: 201,
        data: createNotificationDto,
      };
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      let data = await this.sqlService.run(this.notificationquery.findAll(TableName.Table_Notifications))
      return {
        message: 'return the all data',
        data: data,
        statusCode: 200
      }
    } catch (error) {
      throw error

    }
  }

  findOne(id: number) {
    try {
      let data = this.sqlService.run(this.notificationquery.findOne(TableName.Table_Notifications, id))
      return {
        message: 'return the all data',
        data: data,
        statusCode: 200
      }
    } catch (error) {
      throw error

    }
  }

  async update(updateNotificationDto: UpdateNotificationDto) {
    try {
      for (let updateItem of updateNotificationDto?.items) {
        console.log("update......",updateItem)
        let res = await this.sqlService.run(
          this.notificationquery.findOne(TableName.Table_Notifications, updateItem.sender_id)
        );
    
        // Ensure the record was found
        if (res && res.length > 0) {
          let item = res[0]; 
    
          delete item.created_date;
          delete item.updated_date;
    
          // Prepare the data to be updated
          let updatedData = {
            isRead: Number(updateItem.isRead )|| item.isRead,
          };
    
          // Construct the update query
          const updatePairs = Object.keys(updatedData).map(
            (key) => `${key}='${updatedData[key]}'`
          ).join(", ");
    
          // Apply the update for each item
          let updateRes = await this.sqlService.run(
            this.notificationquery.updateData(TableName.Table_Notifications, updateItem.message_id,updatePairs),
          );
    
        }
      }
    
      return {
        statusCode: 200,
        data: updateNotificationDto
      };
    } catch (error) {
      throw error

    }
    
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
