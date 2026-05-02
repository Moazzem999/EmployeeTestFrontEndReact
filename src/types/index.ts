export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  salary: number;
  isDeleted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  salary: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {}
