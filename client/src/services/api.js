const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async getSession() {
    return this.request("/api/auth/session");
  }

  async signIn(email, password) {
    return this.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signOut() {
    return this.request("/api/auth/signout", {
      method: "POST",
    });
  }

  async register(email, password, name) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/api/user/me");
  }

  async getUserById(id) {
    return this.request(`/api/users/${id}`);
  }

  async updateUser(id, data) {
    return this.request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // COI endpoints (placeholder for future implementation)
  async getCOIs() {
    return this.request("/api/cois");
  }

  async getCOIById(id) {
    return this.request(`/api/cois/${id}`);
  }
}

export const apiService = new ApiService();
