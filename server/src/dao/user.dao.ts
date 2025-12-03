import prisma from "../config/database";
import {
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
} from "../types/user.types";

class UserDao {
  async findById(id: string): Promise<UserResponseDto | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(
    data: CreateUserDto & { password: string }
  ): Promise<UserResponseDto> {
    const normalizedEmail = data.email.toLowerCase().trim();
    return prisma.user.create({
      data: {
        email: normalizedEmail,
        password: data.password,
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmailWithPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    return prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }
}

export default new UserDao();
