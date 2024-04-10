import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ROLE } from '@/constants';
import { UserService } from '@/modules/user/services/user.service';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ApiConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.authConfig.accessTokenPrivateKey,
      });
      let authUser: any;
      switch (payload.role) {
        // case ROLE.ADMIN:
        //   authUser = await this.adminService.findOneById(payload.id);
        //   authUser.role = ROLE.ADMIN;
        //   delete authUser.password;
        //   break;
        default:
          authUser = await this.userService.findOneById(payload.id);
          authUser.role = ROLE.USER;
          delete authUser.password; // Remove the 'password' field
      }
      request['user'] = authUser;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
