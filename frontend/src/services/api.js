// API Base URL - uses environment variable or falls back to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Save a document template to the server
 */
export const saveTemplate = async (data) => {
  const response = await fetch(`${API_URL}/save_template`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to save template');
  return response.json();
};

/**
 * Load a template by code
 */
export const loadTemplate = async (code) => {
  const response = await fetch(`${API_URL}/load_template/${code}`);
  if (!response.ok) throw new Error('Template not found');
  return response.json();
};

/**
 * List all available templates
 */
export const listTemplates = async () => {
  const response = await fetch(`${API_URL}/list_templates`);
  if (!response.ok) throw new Error('Failed to load templates');
  return response.json();
};

/**
 * Delete a template by code
 */
export const deleteTemplate = async (code) => {
  const response = await fetch(`${API_URL}/delete_template/${code}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete template');
  return response.json();
};

/**
 * Generate a Word document from blocks and settings
 * 
 * Mobile-compatible download approach:
 * - Fetches from backend with proper error handling
 * - Returns blob for client-side download handling
 * - Supports both desktop and mobile browsers
 */
export const generateDoc = async (formData) => {
  try {
    console.log('Generating document from API:', API_URL);
    
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      
      if (response.status === 0 || response.status === 503) {
        throw new Error('Backend server is not accessible. Check if Flask is running.');
      }
      throw new Error(`Server error: ${response.status}`);
    }
    
    // Validate response is blob (.docx file)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/vnd.openxmlformats')) {
      console.warn('Unexpected content-type:', contentType);
    }
    
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Server returned empty file');
    }
    
    console.log('✓ Document generated:', blob.size, 'bytes');
    return blob;
  } catch (error) {
    console.error('Document generation error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Cannot connect to backend. Ensure:\n' +
        '1. Flask server is running (python app.py)\n' +
        '2. VITE_API_URL is set correctly (http://localhost:5173 or your IP)'
      );
    }
    
    throw error;
  }
};
