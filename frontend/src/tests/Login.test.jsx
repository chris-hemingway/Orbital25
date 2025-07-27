import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthProvider } from '../components/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login Page', () => {
  it('renders email and password input fields', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login onFinish={() => {}} loading={false} />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login onFinish={() => {}} loading={false} />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Sign In'));

    // Updated to match exact validation message
    expect(await screen.findByText(/please enter your username or email/i)).toBeInTheDocument();
    expect(await screen.findByText(/please enter your password/i)).toBeInTheDocument();
  });

  it('guest login works', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login onFinish={() => {}} loading={false} />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/continue as guest/i));
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});

