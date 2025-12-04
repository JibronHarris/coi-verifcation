import type { RequestOptions } from "../types/api.types";
import type {
  SessionResponse,
  SignInDto,
  RegisterDto,
} from "../types/auth.types";
import type { UserResponse, UpdateUserDto } from "../types/user.types";
import type {
  InsuranceCertificate,
  CreateInsuranceCertificateDto,
  UpdateInsuranceCertificateDto,
} from "../types/insurance-certificate.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle 204 No Content (no response body)
      if (response.status === 204) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return undefined as T;
      }

      // Get response text first to check if it's empty
      const text = await response.text();

      // Parse JSON only if there's content
      let data: any;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          // If parsing fails, use the text as-is
          data = text;
        }
      } else {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          (data as { error?: string })?.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return data as T;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async getSession(): Promise<SessionResponse> {
    return this.request<SessionResponse>("/api/auth/session");
  }

  async signIn(email: string, password: string): Promise<void> {
    const dto: SignInDto = { email, password };
    return this.request<void>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async signOut(): Promise<void> {
    return this.request<void>("/api/auth/signout", {
      method: "POST",
    });
  }

  async register(email: string, password: string, name: string): Promise<void> {
    const dto: RegisterDto = { email, password, name };
    return this.request<void>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  // User endpoints
  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/api/user/me");
  }

  async getUserById(id: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/users/${id}`);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Insurance Certificate endpoints
  async getInsuranceCertificates(): Promise<InsuranceCertificate[]> {
    return this.request<InsuranceCertificate[]>("/api/insuranceCertificates");
  }

  async getInsuranceCertificateById(id: string): Promise<InsuranceCertificate> {
    return this.request<InsuranceCertificate>(
      `/api/insuranceCertificates/${id}`
    );
  }

  async createInsuranceCertificate(
    data: CreateInsuranceCertificateDto
  ): Promise<InsuranceCertificate> {
    return this.request<InsuranceCertificate>("/api/insuranceCertificates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInsuranceCertificate(
    id: string,
    data: UpdateInsuranceCertificateDto
  ): Promise<InsuranceCertificate> {
    return this.request<InsuranceCertificate>(
      `/api/insuranceCertificates/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteInsuranceCertificate(id: string): Promise<void> {
    return this.request<void>(`/api/insuranceCertificates/${id}`, {
      method: "DELETE",
    });
  }

  // Public certificate endpoints (unauthenticated)
  async getPublicCertificateByToken(
    token: string
  ): Promise<InsuranceCertificate> {
    return this.request<InsuranceCertificate>(
      `/api/insuranceCertificates/public/${token}`
    );
  }

  async acceptPublicCertificateByToken(
    token: string
  ): Promise<InsuranceCertificate> {
    return this.request<InsuranceCertificate>(
      `/api/insuranceCertificates/public/${token}/accept`,
      {
        method: "POST",
      }
    );
  }
}

export const apiService = new ApiService();
