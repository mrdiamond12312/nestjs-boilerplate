import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '@/common/utils';
import { ROLE } from '@/constants';
import {
  RegisterDto,
  SignInDto,
} from '@/modules/auth/domains/dtos/request/sign-in.dto';
import { JwtResponseDto } from '@/modules/auth/domains/dtos/response/jwt-response.dto';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<JwtResponseDto> {
    const user = await this.userService.findOneByUserName(signInDto.userName);
    const isMatched = await validateHash(signInDto.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Invalid credential');
    }
    const payload = {
      id: user.id,
      role: ROLE.USER,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async userRegister(registerDto: RegisterDto): Promise<JwtResponseDto> {
    const user = await this.userService.createUser(registerDto);
    return {
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        role: user.role,
      }),
    };
  }

  // async userRegisterByGoogle(
  //   registerDto: GoogleSignInDto,
  // ): Promise<JwtResponseDto> {
  //   const user = await this.userService.registerByGoogle(registerDto);
  //   return {
  //     accessToken: await this.jwtService.signAsync({
  //       id: user.id,
  //       role: user.role,
  //     }),
  //   };
  // }

  // async lessorSignIn(signInDto: SignInDto): Promise<any> {
  //   const lessor = await this.lessorService.findOneByUserName(signInDto.userName);
  //   const isMatched = validateHash(signInDto.password, user.password);
  //   if (!isMatched) {
  //     throw new UnauthorizedException('Invalid credential');
  //   }
  //   const payload = {
  //     id: user.id,
  //     role: ROLE.USER,
  //   };
  //   return {
  //     accessToken: await this.jwtService.signAsync(payload),
  //   };
  // }

  // async changePassWord(signInDto: SignInDto): Promise<any> {
  //   const user = await this.adminService.findOneByUserName(signInDto.userName);
  //   user.password = generateHash(signInDto.password);
  //   await this.adminService.saveUser(user);
  // }

  // async googleLogin(req: any): Promise<JwtResponseDto> {
  //   if (!req.user) {
  //     throw new OAuthException();
  //   }
  //   // Find if user exist in application
  //   const userInApp = await this.userService.findByRequiredInfo({
  //     userName: req.user.email,
  //   });

  //   if (userInApp === null) {
  //     const user = {
  //       userName: req.user.email,
  //       email: req.user.email,
  //       fullName: req.user.lastName + ' ' + req.user.firstName,
  //       password: req.user.email,
  //       avatar: req.user.picture,
  //     };
  //     return this.userRegisterByGoogle(user);
  //   } else {
  //     const payload = {
  //       id: userInApp.id,
  //       role: ROLE.USER,
  //     };
  //     return {
  //       accessToken: await this.jwtService.signAsync(payload),
  //     };
  //   }
  // }
}
