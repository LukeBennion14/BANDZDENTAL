// API Configuration
// Priority: explicit VITE_API_URL > production default > localhost dev default.
// The production default lets deployed builds work even if VITE_API_URL isn't wired up on Vercel.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.PROD ? 'https://bandz-backend.vercel.app' : 'http://localhost:3001');

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Practice-Id': '1', // Default practice ID
};

// Helper function for API calls
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
