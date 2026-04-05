// API Base URL - uses environment variable or fallback
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Helper function to handle responses
 */
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const text = await response.text();
    console.error("API Error:", response.status, text);
    throw new Error(`${errorMessage} (${response.status})`);
  }
  return response.json();
};

/**
 * Save a document template
 */
export const saveTemplate = async (data) => {
  const response = await fetch(`${API_URL}/save_template`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response, 'Failed to save template');
};

/**
 * Load template
 */
export const loadTemplate = async (code) => {
  const response = await fetch(`${API_URL}/load_template/${code}`);
  return handleResponse(response, 'Template not found');
};

/**
 * List templates
 */
export const listTemplates = async () => {
  const response = await fetch(`${API_URL}/list_templates`);
  return handleResponse(response, 'Failed to load templates');
};

/**
 * Delete template
 */
export const deleteTemplate = async (code) => {
  const response = await fetch(`${API_URL}/delete_template/${code}`, {
    method: 'DELETE',
  });
  return handleResponse(response, 'Failed to delete template');
};

/**
 * Generate Word document
 */
export const generateDoc = async (formData) => {
  try {
    console.log('API URL:', API_URL);

    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const blob = await response.blob();

    if (!blob || blob.size === 0) {
      throw new Error('Empty file received from server');
    }

    console.log('✓ Document generated:', blob.size, 'bytes');
    return blob;

  } catch (error) {
    console.error('Error:', error);

    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Cannot connect to backend.\n' +
        '1. Backend server is running\n' +
        '2. VITE_BACKEND_URL is correct\n' +
        '3. CORS is enabled on backend'
      );
    }

    throw error;
  }
};