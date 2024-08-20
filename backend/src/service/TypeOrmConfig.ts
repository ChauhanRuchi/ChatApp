import { TypeOrmModuleAsyncOptions,TypeOrmModuleOptions } from "@nestjs/typeorm";

export default class TypeOrmConfig{
    static getOrmConfig():TypeOrmModuleOptions{
        return{
            type:'mysql',
            host:process.env.DATABASE_HOST,
            port:3306,
            username:process.env.DATABASE_USER,
            password:process.env.DATABASE_PASSWORD,
            database:process.env.DATABASE_NAME,
            synchronize:false,
            logging:false,
            autoLoadEntities:false,
            multipleStatements:true,
            bigNumberStrings:false
        }
    }
}

export const TypeOrmAsyncOptions:TypeOrmModuleAsyncOptions={
    imports:[],
    inject:[],
    useFactory:(): TypeOrmModuleOptions => {
        return TypeOrmConfig.getOrmConfig();
    }
}