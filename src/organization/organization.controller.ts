import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('organization')
@Controller('organization')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create organization' })
  @ApiCreatedResponse({
    description: 'Organization created successfully.',
    example: { organization_id: 'id' },
  })
  @ApiBody({ type: CreateOrganizationDto })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Return all organizations.' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Return organization by id.' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization by id' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully.',
  })
  @ApiBody({ type: CreateOrganizationDto })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite user to organization' })
  @ApiBody({ type: AddMemberDto })
  @ApiCreatedResponse({
    description: 'User invited to organization successfully.',
  })
  async inviteUser(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.organizationService.addMember(id, addMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by id' })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully.',
  })
  async delete(@Param('id') id: string) {
    await this.organizationService.remove(id);
    return { message: 'Organization deleted successfully' };
  }
}
