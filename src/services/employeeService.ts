import api from './api';
import { Employee, ApiResponse, CreateEmployeeDto, UpdateEmployeeDto } from '@/types';

export const employeeService = {
  getAll: async (searchTerm?: string) => {
    const response = await api.get<ApiResponse<Employee[]>>('/api/Employee', {
      params: { searchTerm }
    });
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Employee>>(`/api/Employee/${id}`);
    return response.data.data;
  },

  create: async (data: CreateEmployeeDto) => {
    const response = await api.post<ApiResponse<Employee>>('/api/Employee', data);
    return response.data;
  },

  update: async (id: number, data: UpdateEmployeeDto) => {
    const response = await api.put<ApiResponse<boolean>>(`/api/Employee/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<boolean>>(`/api/Employee/${id}`);
    return response.data;
  }
};

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string }>>('/api/Auth/login', {
      username,
      password
    });
    return response.data;
  }
};
