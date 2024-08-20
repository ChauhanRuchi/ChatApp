import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsQueries {
  insertData(tableName: string, key: any) {
    const query = `INSERT INTO ${tableName} (${key}) values (?, ?, ?, ?, ?)`;
    console.log('queryy', query);
    return {
      name: 'insertData',
      type: 'INSERT',
      query: query,
    };
  }
  findOne(tableName: string, id: number) {
    const query = `SELECT * 
        FROM ${tableName} 
        WHERE sender_id='${id}'`;
    return {
      name: 'selectData',
      type: 'SELECT',
      query: query,
    };
  }
  findAll(tableName: string) {
    const query = `SELECT * FROM ${tableName} where isRead=0`;
    return {
      name: 'selectData',
      type: 'SELECT',
      query: query,
    };
  }

  updateData(tableName: string, sender_id: number,pair) {
    const query = `UPDATE ${tableName} SET ${pair} where message_id='${sender_id}'`;
    console.log('queryry', query);
    return {
      name: 'insertData',
      type: 'INSERT',
      query: query,
    };
  }
}
