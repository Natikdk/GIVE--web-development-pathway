
const BASE_URL = "http://localhost:5000/api";

export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return data;
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};