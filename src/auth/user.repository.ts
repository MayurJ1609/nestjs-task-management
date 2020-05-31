import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      this.logger.error(
        `Exception caught while creating new user with username: ${user.username}`,
        error.stack,
      );
      if (error.code === '23505') {
        this.logger.error(
          `User already exists exception while creating user with username: ${user.username}. Error code: ${error.code}`,
          error.stack,
        );
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(
          `Generic exception caught while creating user with username: ${user.username}. Error code: ${error.code}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      this.logger.debug(
        `Username and Password validation successful for user: ${user}`,
      );
      return user.username;
    } else {
      this.logger.warn(
        `Username and Password validation unsuccessful for user: ${user}`,
      );
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
