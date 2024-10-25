import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto).catch((error) => {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException();
    });
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      email,
    });

    return user;
  }

  update(id: number, updateUserDto: any) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userModel.deleteOne({ _id: id });
    if (user.deletedCount === 0) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
