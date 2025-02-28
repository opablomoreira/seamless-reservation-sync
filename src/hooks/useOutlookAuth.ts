
import { useState, useEffect, useCallback } from 'react';
import { OutlookAuthConfig, OutlookUser, OutlookTokenResponse } from '@/utils/types';

// This is a mock implementation for demonstration
// In a real application, you would use the Microsoft Authentication Library (MSAL)
export function useOutlookAuth() {
  const [user, setUser] = useState<OutlookUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock authentication config
  const authConfig: OutlookAuthConfig = {
    clientId: 'your-client-id', // Replace with actual client ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    scopes: ['User.Read', 'Calendars.ReadWrite']
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock successful authentication
      // In real implementation, you would use:
      // const msalInstance = new PublicClientApplication(authConfig);
      // const response = await msalInstance.loginPopup();
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: OutlookUser = {
        id: 'user-123',
        displayName: 'John Doe',
        email: 'john.doe@example.com',
        photoUrl: 'https://via.placeholder.com/150'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Store auth state in localStorage for persistence
      localStorage.setItem('outlookUser', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication failed'));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Mock logout
      // In real implementation: await msalInstance.logout();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear auth state
      localStorage.removeItem('outlookUser');
      localStorage.removeItem('isAuthenticated');
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<OutlookTokenResponse> => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    
    // Mock token acquisition
    // In real implementation: 
    // const tokenResponse = await msalInstance.acquireTokenSilent({scopes: authConfig.scopes});
    
    return {
      accessToken: 'mock-access-token-xyz',
      expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      isAuthenticated: true
    };
  }, [isAuthenticated]);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('outlookUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getAccessToken,
    authConfig
  };
}
