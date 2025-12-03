// User types for API responses
export interface UserResponseDto {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDto {
  name?: string;
  image?: string;
}
