const API_BASE_URL = 'http://localhost:5000';

export const fetchData = async (endpoint: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const getUser = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return { currentUser: null, isAuthenticated: false };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'GET',
      credentials: 'include'
    });
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const googleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};