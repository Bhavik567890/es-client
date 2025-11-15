export interface Post {
  _id?: string;
  title: string;
  author: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;   
}
