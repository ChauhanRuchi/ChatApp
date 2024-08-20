import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TableName } from "src/common/app.constants";
import { UsersQueries } from "src/module/user/user.query";
import { SqlserviceService } from "src/service/sqlService";
@Injectable()
export class OtpMiddleware implements NestMiddleware {

    constructor(
        private jwtService: JwtService,
        private sqlService: SqlserviceService,
        private userQueries: UsersQueries
    ) { }

    async use(req: Request, res: any, next: (error?: any) => void) {
        try {
            if (req.headers.authorization) {

                var token: string = req.headers.authorization.split(' ')[1];
                let decoded: any = await this.jwtService.verify(token, { secret: 'asdfghjkljkl'});
                let data = await this.sqlService.run(this.userQueries.checkOtpEmail(TableName.Table_Users, decoded?.email))
                if (!token) {
                    throw new UnauthorizedException();

                }
                else if (data?.otp_access_token !== token) {
                    return "invalid token"

                }

                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: 'asdfghjkljkl'
                    }
                );

                req['user'] = payload;
                next();
            } else {
                throw new UnauthorizedException()
            }
        } catch (error) {
            console.log("vvvv", error)
            throw new UnauthorizedException();

            // UnauthorizedException()
        }

    }
}