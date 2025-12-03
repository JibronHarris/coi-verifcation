export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
}
