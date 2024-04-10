import { Module } from '@nestjs/common';

import { UserController } from '@/modules/user/controllers/user.controller';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserService } from '@/modules/user/services/user.service';

@Module({
  imports: [],
  exports: [UserService],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
