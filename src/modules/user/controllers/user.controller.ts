import { Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { UserUpdateDto } from '@/modules/user/domains/dtos/request/user-update.dto';
import { UserDto } from '@/modules/user/domains/dtos/response/user.dto';
import { UserService } from '@/modules/user/services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Auth([ROLE.USER])
  @Patch('/update')
  async updateUser(@Body() user: UserUpdateDto): Promise<UserDto> {
    return this.userService.updateUser(user);
  }
}
