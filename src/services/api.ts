import axios from 'axios'
import { ExpenseFormData } from "@/types/expense"
import { ApiError } from '@/types/api'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear any auth state
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

interface ExpenseFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
  sort?: 'date' | 'amount' | 'category';
  order?: 'asc' | 'desc';
}

export const expenseApi = {
  getExpenses: async (filters: ExpenseFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })
    const response = await api.get(`/expenses?${params.toString()}`)
    return response.data
  },

  addExpense: async (expense: ExpenseFormData) => {
    try {
      const response = await api.post('/expenses', expense)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Failed to add expense')
    }
  },

  updateExpense: async (id: string, expense: ExpenseFormData) => {
    const response = await api.patch(`/expenses/${id}`, expense)
    return response.data
  },

  deleteExpense: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`)
    return response.data
  }
}

// Add auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  register: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  }
} 
