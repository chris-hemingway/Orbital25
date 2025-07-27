import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/AuthContext';

// 👇 Replace with a valid dummy JWT
const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoyNTM0MDY0NDAwfQ.' +
  'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('should login with token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.login(validToken));

    expect(localStorage.getItem('token')).toBe(validToken);
    expect(result.current.username).toBe('testuser');
    expect(result.current.isGuest).toBe(false);
  });

  it('should login as guest', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.loginAsGuest());

    expect(result.current.username).toBe('Guest');
    expect(result.current.token).toBe(null);
    expect(result.current.isGuest).toBe(true);
  });

  it('should logout and clear token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(validToken);
      result.current.logout();
    });

    expect(localStorage.getItem('token')).toBe(null);
    expect(result.current.username).toBe(null);
    expect(result.current.isGuest).toBe(false);
  });
});
