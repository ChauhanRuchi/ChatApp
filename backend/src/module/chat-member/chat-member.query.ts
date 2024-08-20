import { Injectable } from '@nestjs/common'


@Injectable()
export class ChatMemberQueries {
    
    insertData(tableName: string, key: any,) {
        const query = `INSERT INTO ${tableName} (${key}) values (?)`;
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }
    findOne(tableName: string, all: any) {
        const query = `SELECT * 
        FROM ${tableName} 
        WHERE JSON_CONTAINS(members, JSON_ARRAY(${all[0]}, ${all[1]}), '$')`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };
    }
    findUserChat(tableName: string, id: any) {
        const query = `SELECT * FROM ${tableName} where JSON_CONTAINS(members, '${id}', '$')`;
        
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }
    findAll(tableName: string) {
        const query = `SELECT * FROM ${tableName}`;
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }

    updateData(tableName: string, user_id:string) {
        const query = `UPDATE ${tableName} SET user_name=? , full_name=?, mobile_number=? where user_id=${user_id}`;
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }


}
