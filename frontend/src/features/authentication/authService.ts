import apiClient from "../../api/client";
import API_ENDPOINTS from "../../api/endpoints";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: "customer" | "admin";
}

export interface RegisterData {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetConfirmData {
  uid: string;
  token: string;
  new_password: string;
  new_password_confirm: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.accounts.register,
      data,
    );

    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.accounts.login,
      data,
    );

    return response.data;
  },

  async logout(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.accounts.logout,
    );

    return response.data;
  },

  async getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<{ user: AuthUser }>(
    API_ENDPOINTS.accounts.profile,
  );

  return response.data.user;
},
  async requestPasswordReset(
    data: PasswordResetRequestData,
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.accounts.passwordReset,
      data,
    );

    return response.data;
  },

  async confirmPasswordReset(
    data: PasswordResetConfirmData,
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.accounts.passwordResetConfirm,
      data,
    );

    return response.data;
  },
};

