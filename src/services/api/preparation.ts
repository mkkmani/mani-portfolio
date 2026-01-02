import { apiRequest } from './base';
import type { IPublishRequest } from '@/types/api';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  feedback?: 'like' | 'dislike' | null;
  createdAt: string;
}

export interface IPreparation {
  _id: string;
  topic: string;
  slug: string;
  title: string;
  excerpt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  messages: IMessage[];
  published: boolean;
  userId?: string;
  publishRequests?: IPublishRequest[];
  createdAt: string;
  updatedAt: string;
  // Access metadata (returned by API)
  userRole?: 'admin' | 'owner' | 'viewer';
  canPublish?: boolean;
  canRequestPublish?: boolean;
  hasPublishRequest?: boolean;
  publishRequestStatus?: 'pending' | 'approved' | 'rejected';
}

export async function getPreparations(all: boolean = false): Promise<IPreparation[]> {
  try {
    return await apiRequest<IPreparation[]>('/api/interview-prep', {
      params: { all },
    });
  } catch (error) {
    console.error('Error fetching preparations:', error);
    return [];
  }
}

export async function getPreparationBySlug(slug: string): Promise<IPreparation | null> {
  try {
    return await apiRequest<IPreparation>(`/api/interview-prep?slug=${slug}`);
  } catch (error) {
    console.error(`Error fetching preparation ${slug}:`, error);
    return null;
  }
}

export async function togglePreparationPublish(id: string, published: boolean): Promise<IPreparation | null> {
  try {
    return await apiRequest<IPreparation>('/api/interview-prep', {
      method: 'PATCH',
      body: JSON.stringify({ _id: id, published }),
    });
  } catch (error) {
    console.error('Error toggling publish:', error);
    return null;
  }
}

export async function submitFeedback(id: string, messageIndex: number, feedback: 'like' | 'dislike'): Promise<IPreparation | null> {
  try {
    return await apiRequest<IPreparation>('/api/interview-prep', {
      method: 'PATCH',
      body: JSON.stringify({ _id: id, messageIndex, feedback }),
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return null;
  }
}

export async function requestPublish(id: string): Promise<void> {
  try {
    await apiRequest(`/api/publish-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'preparation',
        contentId: id,
      }),
    });
  } catch (error) {
    console.error('Request publish error:', error);
    throw error;
  }
}

export async function discardPreparation(id: string): Promise<void> {
  try {
    await apiRequest(`/api/interview-prep?id=${id}&type=discard`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Discard preparation error:', error);
    throw error;
  }
}

export async function permanentDeletePreparation(id: string): Promise<void> {
  try {
    await apiRequest(`/api/interview-prep?id=${id}&type=permanent`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Permanent delete preparation error:', error);
    throw error;
  }
}
