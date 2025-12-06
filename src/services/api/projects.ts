import { apiRequest } from './base';
import { IProject } from '@/types/api';


export async function getProjects(): Promise<IProject[]> {
  try {
    return await apiRequest<IProject[]>('/api/projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}


export async function getFeaturedProjects(): Promise<IProject[]> {
  try {
    const allProjects = await apiRequest<IProject[]>('/api/projects');
    const favourites = allProjects.filter(p => p.favourite);

    if (favourites.length > 0) {
      return favourites.slice(0, 3);
    }

    return allProjects.slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getAllProjects(): Promise<IProject[]> {
  try {
    return await apiRequest<IProject[]>('/api/projects', {
      params: { all: true },
    });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}
