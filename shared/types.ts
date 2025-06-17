// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutDates {
  id: string;
  email: string;
  name?: string;
}

// Document types
export interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentSummary {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  message: string;
  user: UserWithoutDates;
  token: string;
}

// Document API types
export interface CreateDocumentRequest {
  title: string;
  content?: string;
  isPublic?: boolean;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}
