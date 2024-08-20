import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as _ from "lodash";

@Injectable()
export class SqlserviceService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async run(queryObj: any = null, data: any = null) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let result: any;

    await queryRunner.startTransaction();

    try {
      const rows = await queryRunner.query(queryObj.query, data);

      if (queryObj.type == "SELECT_ONE") {
        result = !_.isEmpty(rows) ? rows[0] : null;
      } else {
        result = rows;
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return result;
  }
}
