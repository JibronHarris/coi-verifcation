import userDao from "../dao/user.dao";
import { UpdateUserDto, UserResponseDto } from "../types/user.types";

class UserService {
  async getUserById(id: string): Promise<UserResponseDto | null> {
    return userDao.findById(id);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    return userDao.findAll();
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await userDao.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return userDao.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    const existingUser = await userDao.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await userDao.delete(id);
  }

  async canUserModify(userId: string, targetUserId: string): Promise<boolean> {
    return userId === targetUserId;
  }
}

export default new UserService();
