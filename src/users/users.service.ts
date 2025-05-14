import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(tenantId: number, dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { tenantId, username: dto.username },
        { tenantId, email: dto.email }
      ]
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists in this tenant');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      tenantId,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(tenantId: number, queryParams: ListUsersDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = queryParams;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.tenantId = :tenantId', { tenantId });

    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters.username) {
      queryBuilder.andWhere('user.username ILIKE :username', { username: `%${filters.username}%` });
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.fullName) {
      queryBuilder.andWhere('user.fullName ILIKE :fullName', { fullName: `%${filters.fullName}%` });
    }

    queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(tenantId: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(tenantId: number, userId: number, dto: UpdateUserDto) {
    const user = await this.findOne(tenantId, userId);

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { tenantId, email: dto.email }
      });
      if (existingEmail) {
        throw new BadRequestException('Email already exists in this tenant');
      }
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(tenantId: number, userId: number) {
    const user = await this.findOne(tenantId, userId);
    user.isActive = false;
    await this.userRepository.save(user);
  }
}