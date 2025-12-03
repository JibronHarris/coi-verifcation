// Auth types for API requests/responses
export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  email: string | null;
  name: string | null;
}

export interface AuthResponseDto {
  user: AuthUserDto;
}

export interface RegisterResponseDto {
  message: string;
  user: AuthUserDto & {
    createdAt: Date;
  };
}
