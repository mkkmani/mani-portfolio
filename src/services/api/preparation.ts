import { apiRequest } from './base';

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
  createdAt: string;
  updatedAt: string;
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
