// Use environment variable for production, fallback to localhost for development
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api";

// Production: https://ignite-backend-07fb.onrender.com/api

// Test connectivity - call this from browser console: testConnection()
export const testConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/countries?locale=en`);
    console.log('✅ Connection test successful:', response.status);
    return response.ok;
  } catch (error) {
    console.error('❌ Connection test failed:', {
      error: error instanceof Error ? error.message : String(error),
      url: `${BASE_URL}/auth/countries`
    });
    return false;
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testConnection = testConnection;
  console.log('🔍 Debug: testConnection() available in console. Type testConnection() to test backend connectivity.');
}
