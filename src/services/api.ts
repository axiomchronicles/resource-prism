// API service layer for Starlette backend integration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'notes' | 'ppt' | 'paper' | 'tutorial';
  subject: string;
  semester: string;
  course_code: string;
  author: string;
  file_url: string;
  thumbnail_url?: string;
  downloads: number;
  rating: number;
  pages?: number;
  duration?: string;
  tags: string[];
  upload_date: string;
  is_featured: boolean;
  is_trending: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  university: string;
  semester: string;
  uploads_count: number;
  downloads_count: number;
  joined_date: string;
}

export interface Comment {
  id: string;
  resource_id: string;
  user: User;
  content: string;
  rating?: number;
  created_at: string;
  replies?: Comment[];
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add authorization header when implementing auth
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Resources API
  async getResources(params?: {
    type?: string;
    subject?: string;
    semester?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
  }): Promise<ApiResponse<Resource[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    return this.request<Resource[]>(`/resources?${searchParams}`);
  }

  async getResource(id: string): Promise<ApiResponse<Resource>> {
    return this.request<Resource>(`/resources/${id}`);
  }

  async uploadResource(formData: FormData): Promise<ApiResponse<Resource>> {
    return this.request<Resource>('/resources', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  async deleteResource(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadResource(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/resources/${id}/download`);
    return response.blob();
  }

  // Search API
  async searchResources(query: string): Promise<ApiResponse<Resource[]>> {
    return this.request<Resource[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Comments API
  async getComments(resourceId: string): Promise<ApiResponse<Comment[]>> {
    return this.request<Comment[]>(`/resources/${resourceId}/comments`);
  }

  async addComment(resourceId: string, content: string, rating?: number): Promise<ApiResponse<Comment>> {
    return this.request<Comment>(`/resources/${resourceId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, rating }),
    });
  }

  // User API
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserUploads(): Promise<ApiResponse<Resource[]>> {
    return this.request<Resource[]>('/user/uploads');
  }

  async getUserFavorites(): Promise<ApiResponse<Resource[]>> {
    return this.request<Resource[]>('/user/favorites');
  }

  async toggleFavorite(resourceId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/user/favorites/${resourceId}`, {
      method: 'POST',
    });
  }

  // Analytics API
  async getStats(): Promise<ApiResponse<{
    total_resources: number;
    total_users: number;
    total_downloads: number;
    total_universities: number;
  }>> {
    return this.request('/stats');
  }

  async getTrendingResources(): Promise<ApiResponse<Resource[]>> {
    return this.request<Resource[]>('/trending');
  }

  async getFeaturedResources(): Promise<ApiResponse<Resource[]>> {
    return this.request<Resource[]>('/featured');
  }

  // Categories API
  async getSubjects(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/subjects');
  }

  async getTags(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/tags');
  }

  // University API
  async getUniversities(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/universities');
  }
}

export const apiService = new ApiService();