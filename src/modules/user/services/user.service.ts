import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'lodash';

import { generateHash, validateHash } from '@/common/utils';
// import { ROLE } from '@/constants';
// import { GoogleSignInDto } from '@/modules/auth/domains/dtos/google-sign-in.dto';
import { UserNotFoundException } from '@/exceptions';
import { RegisterDto } from '@/modules/auth/domains/dtos/request/sign-in.dto';
import { UserUpdateDto } from '@/modules/user/domains/dtos/request/user-update.dto';
import { UserDto } from '@/modules/user/domains/dtos/response/user.dto';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(readonly userRepository: UserRepository) {}

  async findOneByUserName(userName: string): Promise<UserEntity> {
    const user = await this.userRepository.findUserByUserName(userName);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async createUser(registerDto: RegisterDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.insert({
        ...registerDto,
        password: generateHash(registerDto.password),
      });

      return user.raw[0];
    } catch (error) {
      throw new BadRequestException();
    }
  }

  // async registerByGoogle(registerDto: GoogleSignInDto): Promise<UserEntity> {
  //   try {
  //     const user = await this.userRepository.insert({
  //       ...registerDto,
  //       password: generateHash(registerDto.password),
  //     });

  //     return user.raw[0];
  //   } catch (error) {
  //     throw new BadRequestException();
  //   }
  // }

  async findByRequiredInfo(findOptions: object): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy(findOptions);
  }

  async updateUser(user: UserUpdateDto): Promise<UserDto> {
    const userInDB = await this.findOneById(user.id);
    const isPasswordMatched = await validateHash(
      user.password,
      userInDB.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect password!');
    }
    user.password = generateHash(user.password);
    const userToUpdate = omit(user, ['role']);

    const queryResult = await this.userRepository.updateUser(userToUpdate);
    return omit(queryResult, ['password']);
  }

  async updateJwtUser(user: UserUpdateDto): Promise<UserDto> {
    const queryResult = await this.userRepository.updateUser(user);
    return omit(queryResult, ['password']);
  }
}
