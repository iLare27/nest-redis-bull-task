import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { getQueueToken } from "@nestjs/bull";

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn()
    };

    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn()
    };

    const mockQueue = {
      add: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getQueueToken('user-queue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return true if email is unique', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    expect(await service.checkEmailUniqueness('unique@example.com')).toBe(true);
  });

  it('should return false if email is not unique', async () => {
    mockRepository.findOne.mockResolvedValue(new User());
    expect(await service.checkEmailUniqueness('existing@example.com')).toBe(false);
  });
});
