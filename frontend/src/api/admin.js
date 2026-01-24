// frontend/src/api/admin.js
const BASE_URL = "http://localhost:5000/api/admin";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Set auth headers
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// ===== AUTHENTICATION =====
export const adminLogin = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token and admin info
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  window.location.href = '/admin/login';
};

export const getAdminProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        adminLogout();
      }
      throw new Error(data.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ===== DASHBOARD =====
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get stats');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ===== CONTACTS MANAGEMENT =====
export const getContacts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/contacts?${queryString}`, {
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get contacts');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${id}`, {
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get contact');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (id, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/contacts/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update contact');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ===== LESSONS MANAGEMENT =====
export const getAdminLessons = async () => {
  try {
    const response = await fetch(`${BASE_URL}/lessons`, {
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get lessons');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const createLesson = async (lessonData) => {
  try {
    const response = await fetch(`${BASE_URL}/lessons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(lessonData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create lesson');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const updateLesson = async (id, lessonData) => {
  try {
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(lessonData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update lesson');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteLesson = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete lesson');
    }

    return data;
  } catch (error) {
    throw error;
  }
};