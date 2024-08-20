import { Injectable } from '@nestjs/common'


@Injectable()
export class MessageQueries {
    
    insertData(tableName: string, key: any,) {
        const query = `INSERT INTO ${tableName} (${key}) values (?, ?, ?, ?, ?)`;
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }
    findOne(tableName: string, all: any) {
        const query = `SELECT * FROM ${tableName} where chat_id='${all}'`;
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }
    findUpdateStatus(tableName: string, id: any) {
        const query = `SELECT * FROM ${tableName} where sender_id='${id}'`;
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }
    findMessage(tableName: string, all: any) {
        const query = `SELECT * FROM ${tableName} where chat_id='${all}'`;
        
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }
    findUserChat(tableName: string, id: any) {
        const query = `SELECT * FROM ${tableName} where members in'${id}'`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };
    }
    findAll(tableName: string) {
        const query = `SELECT * FROM ${tableName}'`;
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }

    updateData(tableName: string, message_id:number) {
        const query = `UPDATE ${tableName} SET  status=? where sender_id=${message_id}`;
        console.log("queryry",query)
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }


}
