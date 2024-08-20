import { Injectable } from '@nestjs/common'


@Injectable()
export class UsersQueries {
    
    insertData(tableName: string, key: any,) {
        const query = `INSERT INTO ${tableName} (${key}) values (?, ?, ?, ?, ?)`;
        console.log("queryry",query)
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }
    insertDataOtp(tableName: string, key: any,) {
        const query = `INSERT INTO ${tableName} (${key}) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp) , expiry_time = VALUES(expiry_time) ,otp_access_token = VALUES(otp_access_token)`;
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }
    insertDataDevice(tableName: string, key: any,) {
        const query = `INSERT INTO ${tableName} (${key}) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE access_token = VALUES(access_token) , refresh_token = VALUES(refresh_token)`;
        console.log("queryry",query)
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }
    findOne(tableName: string, email: string) {
        const query = `SELECT * FROM ${tableName} where email='${email}'`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };
    }
    findOneUser(tableName: string, id: number) {
        const query = `SELECT * FROM ${tableName} where user_id='${id}'`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };
    }
    findAll(tableName: string) {
        const query = `SELECT * FROM ${tableName} `;
        return {
            name: 'selectData',
            type: 'SELECT',
            query: query,
        };
    }
    findOneDevice(tableName: string, device_name: string) {
        const query = `SELECT * FROM ${tableName} where device_name='${device_name}'`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };
    }

    updateData(tableName: string, user_id:string) {
        const query = `UPDATE ${tableName} SET user_name=? , full_name=?, mobile_number=? where user_id=${user_id}`;
        console.log("queryry",query)
        return {
            name: 'insertData',
            type: 'INSERT',
            query: query,
        };
    }

    checkOtpEmail(tableName: string, email:string){
        const query = `SELECT * FROM ${tableName} where email='${email}'`;
        return {
            name: 'selectData',
            type: 'SELECT_ONE',
            query: query,
        };

    }
}
