// src/api/lessons.js
const BASE_URL = "http://localhost:5000/api";

export const fetchAllLessons = async () => {
  try {
    console.log('Fetching lessons from:', `${BASE_URL}/lessons`);
    const response = await fetch(`${BASE_URL}/lessons`);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Lessons data received:', data);
    return data;
    
  } catch (error) {
    console.error('Network error fetching lessons:', error);
    throw error;
  }
};

export const fetchLessonBySlug = async (slug) => {
  try {
    console.log('Fetching lesson:', slug);
    const response = await fetch(`${BASE_URL}/lessons/${slug}`);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Lesson "${slug}" not found`);
      }
      throw new Error(`Failed to fetch lesson: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Lesson data received:', data);
    return data;
    
  } catch (error) {
    console.error(`Error fetching lesson ${slug}:`, error);
    throw error;
  }
};