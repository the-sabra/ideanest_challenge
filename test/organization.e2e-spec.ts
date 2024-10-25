import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OrganizationModule } from '../src/organization/organization.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { OrganizationService } from '../src/organization/organization.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from 'src/organization/entities/organization.entity';
import { CreateOrganizationDto } from '../src/organization/dto/create-organization.dto';
import { AddMemberDto } from '../src/organization/dto/add-member.dto';

describe('OrganizationController (e2e)', () => {
  let app: INestApplication;
  let _organizationModel: Model<Organization>;

  const createOrganizationDto = {
    name: 'Test Org',
    description: 'Test Description',
  };

  const organizationService = {
    create: (dto: CreateOrganizationDto) => ({ organization_id: '1', ...dto }),
    findAll: () => [
      {
        organization_id: '1',
        name: 'Test Org',
        description: 'Test Description',
      },
    ],
    findById: (id: string) => ({
      organization_id: id,
      name: 'Test Org',
      description: 'Test Description',
    }),
    addMember: (_id: string, _dto: AddMemberDto) => ({
      message: 'User invited to organization successfully.',
    }),
    update: (id: string, dto: CreateOrganizationDto) => ({
      organization_id: id,
      ...dto,
    }),
    remove: (_id: string) => ({ message: 'Organization deleted successfully' }),
  };

  const mockOrganizationModel = {
    new: jest.fn().mockResolvedValue(organizationService.findAll()),
    constructor: jest.fn().mockResolvedValue(organizationService.findAll()),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrganizationModule],
    })
      .overrideProvider(OrganizationService)
      .useValue(organizationService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getModelToken('Organization'))
      .useValue(mockOrganizationModel)
      .overrideProvider(getModelToken('User'))
      .useValue({
        new: jest.fn(),
        constructor: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      })
      .overrideProvider('JwtService')
      .useValue({
        sign: jest.fn().mockReturnValue('test-token'),
        verify: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const makeRequest = (method: string, url: string, body?: any) => {
    const req = request(app.getHttpServer())
      [method](url)
      .set('Authorization', 'Bearer test-token');
    if (body) {
      req.send(body);
    }
    return req;
  };

  it('/organization (POST)', async () => {
    const response = await makeRequest(
      'post',
      '/organization',
      createOrganizationDto,
    ).expect(201);

    expect(response.body).toHaveProperty('organization_id');
  });

  it('/organization (GET)', async () => {
    const response = await makeRequest('get', '/organization').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/organization/:id (GET)', async () => {
    const createResponse = await makeRequest(
      'post',
      '/organization',
      createOrganizationDto,
    ).expect(201);

    const organizationId = createResponse.body.organization_id;

    const response = await makeRequest(
      'get',
      `/organization/${organizationId}`,
    ).expect(200);

    expect(response.body).toHaveProperty('organization_id', organizationId);
  });

  it('/organization/:id (PUT)', async () => {
    const updateOrganizationDto = {
      name: 'Updated Org',
      description: 'Updated Description',
    };
    const createResponse = await makeRequest(
      'post',
      '/organization',
      createOrganizationDto,
    ).expect(201);

    const organizationId = createResponse.body.organization_id;

    const response = await makeRequest(
      'put',
      `/organization/${organizationId}`,
      updateOrganizationDto,
    ).expect(200);

    expect(response.body).toHaveProperty('organization_id', organizationId);
    expect(response.body).toHaveProperty('name', 'Updated Org');
  });

  it('/organization/:id/invite (POST)', async () => {
    const addMemberDto = { userId: 'test-user-id' };
    const createResponse = await makeRequest(
      'post',
      '/organization',
      createOrganizationDto,
    ).expect(201);

    const organizationId = createResponse.body.organization_id;

    const response = await makeRequest(
      'post',
      `/organization/${organizationId}/invite`,
      addMemberDto,
    ).expect(201);

    expect(response.body).toHaveProperty(
      'message',
      'User invited to organization successfully.',
    );
  });

  it('/organization/:id (DELETE)', async () => {
    const createResponse = await makeRequest(
      'post',
      '/organization',
      createOrganizationDto,
    ).expect(201);

    const organizationId = createResponse.body.organization_id;

    const response = await makeRequest(
      'delete',
      `/organization/${organizationId}`,
    ).expect(200);

    expect(response.body).toHaveProperty(
      'message',
      'Organization deleted successfully.',
    );
  });
});
