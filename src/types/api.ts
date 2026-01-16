export interface IProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  published: boolean;
  favourite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPublishRequest {
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface IContentAccessInfo {
  userRole: 'admin' | 'owner' | 'viewer';
  canPublish: boolean;
  canRequestPublish: boolean;
  hasPublishRequest: boolean;
  publishRequestStatus?: 'pending' | 'approved' | 'rejected';
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  published: boolean;
  favourite?: boolean;
  userId?: string;
  customDate?: string | Date;
  publishRequests?: IPublishRequest[];
  // Access metadata (returned by API)
  userRole?: 'admin' | 'owner' | 'viewer';
  canPublish?: boolean;
  canRequestPublish?: boolean;
  hasPublishRequest?: boolean;
  publishRequestStatus?: 'pending' | 'approved' | 'rejected';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface IContact {
  _id?: string;
  name: string;
  email: string;
  message: string;
  verified?: boolean;
  createdAt?: string;
}

export interface IAuthResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
    name?: string;
  };
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name?: string;
}
