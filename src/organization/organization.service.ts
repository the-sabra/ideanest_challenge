import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AddMemberDto } from './dto/add-member.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: mongoose.Model<Organization>,
    private readonly userService: UserService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.organizationModel.create(
      createOrganizationDto,
    );
    return { organization_id: organization.id };
  }

  findAll() {
    return this.organizationModel
      .find()
      .populate({
        path: 'organization_members',
        select: 'email name access_level',
      })
      .exec();
  }

  findById(id: string) {
    return this.organizationModel
      .findById(id)
      .populate({
        path: 'organization_members',
        select: 'email name access_level',
      })
      .exec();
  }

  async update(id: string, updateOrganizationDto: CreateOrganizationDto) {
    await this.organizationModel.updateOne({ _id: id }, updateOrganizationDto);

    const org = await this.findById(id);

    return {
      organization_id: org.id,
      name: org.name,
      description: org.description,
    };
  }

  remove(id: string) {
    return this.organizationModel.deleteOne({ _id: id });
  }

  async addMember(id: string, addMemberDto: AddMemberDto) {
    const org = await this.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found.');
    }

    //check user exist
    const user = await this.userService.findByEmail(addMemberDto.user_email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    org.organization_members.push(user.id);

    await org.save();

    return { message: 'Member added successfully.' };
  }
}
