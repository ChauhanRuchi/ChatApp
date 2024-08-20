import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: any, next: (error?: any) => void) {
        try {
            if (req.headers.authorization) {

                var token: string = req.headers.authorization.split(' ')[1];
                if (!token) {
                    throw new UnauthorizedException();
                }

                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: 'asdfghjkljkl'
                    }
                );
                // 💡 We're assigning the payload to the request object here
                // so that we can access it in our route handlers
                req['user'] = payload;
                next();
            } else {
                throw new UnauthorizedException()
            }
        } catch (error) {
            throw new UnauthorizedException();

            // UnauthorizedException()
        }

    }
}