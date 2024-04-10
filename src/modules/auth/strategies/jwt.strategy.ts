import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// import { ROLE } from '@/constants';
import { Unauthorized } from '@/exceptions/unauthorized.exception';
import { UserService } from '@/modules/user/services/user.service';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt' as const) {
  constructor(
    private apiConfigService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.accessTokenPrivateKey,
    });
  }

  async validate(payload) {
    const role = payload.role;

    if (!role) {
      throw new Unauthorized('Invalid role');
    }
    try {
      let authUser: any;
      switch (payload.role) {
        // case ROLE.ADMIN:
        //   authUser = await this.adminService.findOneById(payload.id);
        //   delete authUser.password; // Remove the 'password' field
        //   break;
        default:
          authUser = await this.userService.findOneById(payload.id);
          delete authUser.password; // Remove the 'password' field
      }
      return { ...authUser, role };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
