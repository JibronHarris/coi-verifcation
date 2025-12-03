import bcrypt from "bcryptjs";
import userDao from "../dao/user.dao";
import { RegisterDto, AuthUserDto } from "../types/auth.types";
import { UserResponseDto } from "../types/user.types";

class AuthService {
  async register(data: RegisterDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await userDao.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    return userDao.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });
  }

  async getUserForAuth(id: string): Promise<AuthUserDto | null> {
    const user = await userDao.findById(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getUserForSession(id: string): Promise<AuthUserDto | null> {
    return this.getUserForAuth(id);
  }
}

export default new AuthService();
