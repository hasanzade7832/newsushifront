// src/libs/api.ts
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const TOKEN_KEY = "sushi_token";
const AUTH_KEY = "sushi_auth";

const api = axios.create({
  baseURL: API_BASE,
});

// ===== توکن در همه درخواست‌ها =====
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

// ===== انواع =====

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  discountPrice?: number | null;
  sku: string;
  stock: number;
  slug: string;
  isActive: boolean;
  imageFileName?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
};

export type PagedProducts = {
  total: number;
  page: number;
  pageSize: number;
  items: Product[];
};

export type AuthResponse = {
  token: string;
  userId: number;
  userName: string;
  email: string;
  isAdmin: boolean;
};

export type LoginRequest = {
  userNameOrEmail: string;
  password: string;
};

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
};

export type AppUserSummary = {
  id: number;
  userName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

export type AdminCreateUserRequest = {
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type AdminUpdateUserRequest = {
  userName: string;
  email: string;
  isAdmin: boolean;
};

// پروفایل کاربر
export type Profile = {
  id: number;
  userName: string;
  email: string;
  isAdmin: boolean;
  avatarFileName?: string | null;
  createdAt: string;
};

// ===== Helpers برای ذخیره / خواندن Auth =====

export function saveAuth(auth: AuthResponse) {
  if (typeof window === "undefined") return;

  // توکن برای interceptor
  window.localStorage.setItem(TOKEN_KEY, auth.token);

  // کل آبجکت برای UserMenu و بقیه
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(AUTH_KEY);
}

export function getStoredAuth(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

// ===== Auth APIs =====

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  const auth = res.data;

  // ذخیره‌ی کامل auth (توکن + اطلاعات کاربر)
  saveAuth(auth);

  return auth;
}

export async function register(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  const auth = res.data;

  // بعد از ثبت‌نام هم مثل لاگین ذخیره می‌کنیم
  saveAuth(auth);

  return auth;
}

// ===== Product APIs =====

export async function getProducts(
  page = 1,
  pageSize = 50,
  search?: string
): Promise<PagedProducts> {
  const res = await api.get<PagedProducts>("/products", {
    params: { page, pageSize, search },
  });
  return res.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await api.get<Product>(`/products/by-slug/${slug}`);
  return res.data;
}

export async function createProduct(formData: FormData): Promise<Product> {
  const res = await api.post<Product>("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateProduct(
  id: number,
  formData: FormData
): Promise<void> {
  await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

// ===== Admin Users APIs =====

export async function getUsers(): Promise<AppUserSummary[]> {
  const res = await api.get<AppUserSummary[]>("/admin/users");
  return res.data;
}

export async function updateUserRole(
  id: number,
  isAdmin: boolean
): Promise<void> {
  await api.put(`/admin/users/${id}/role`, { isAdmin });
}

export async function adminCreateUser(
  payload: AdminCreateUserRequest
): Promise<AppUserSummary> {
  const res = await api.post<AppUserSummary>("/admin/users", payload);
  return res.data;
}

export async function adminUpdateUser(
  id: number,
  payload: AdminUpdateUserRequest
): Promise<AppUserSummary> {
  const res = await api.put<AppUserSummary>(`/admin/users/${id}`, payload);
  return res.data;
}

export async function adminDeleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

// ===== Profile APIs =====

export async function getProfile(): Promise<Profile> {
  const res = await api.get<Profile>("/profile");
  return res.data;
}

export async function updateProfile(form: FormData): Promise<Profile> {
  const res = await api.put<Profile>("/profile", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export default api;
