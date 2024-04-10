import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import {
  RegisterDto,
  SignInDto,
} from '@/modules/auth/domains/dtos/request/sign-in.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ContextProvider } from '@/providers';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async userSignIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Auth([ROLE.USER])
  @Get('profile')
  getProfile() {
    return ContextProvider.getAuthUser();
  }

  @Post('register')
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto);
  }
}
