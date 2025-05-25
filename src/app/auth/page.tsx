'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AuthTabs from '@/components/AuthTabs';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

type AuthFormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [loginFormData, setLoginFormData] = useState<AuthFormData>({ email: '', password: '' });
  const [registerFormData, setRegisterFormData] = useState<AuthFormData>({ email: '', password: '' });
  
  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState<Partial<AuthFormData>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<AuthFormData>>({});
  
  // Response message states
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [registerMessage, setRegisterMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      }
      
      setIsCheckingAuth(false);
    };
    
    checkUser();
  }, [router]);

  // Validate login form
  const validateLoginForm = () => {
    const errors: Partial<AuthFormData> = {};
    
    if (!loginFormData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!loginFormData.password) {
      errors.password = 'Password is required';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate register form
  const validateRegisterForm = () => {
    const errors: Partial<AuthFormData> = {};
    
    if (!registerFormData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registerFormData.password) {
      errors.password = 'Password is required';
    } else if (registerFormData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({ ...prev, [name]: value }));
    setLoginErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Handle register form input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({ ...prev, [name]: value }));
    setRegisterErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsLoginLoading(true);
    setLoginMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginFormData.email,
        password: loginFormData.password,
      });
      
      if (error) {
        setLoginMessage({ type: 'error', text: error.message });
      } else {
        setLoginMessage({ type: 'success', text: 'Logged in successfully!' });
        router.push('/dashboard');
      }
    } catch (error) {
      setLoginMessage({ type: 'error', text: 'An unexpected error occurred' });
      console.error('Login error:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsRegisterLoading(true);
    setRegisterMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerFormData.email,
        password: registerFormData.password,
      });
      
      if (error) {
        setRegisterMessage({ type: 'error', text: error.message });
      } else {
        // Auto sign in after registration (since we're not using email verification)
        await supabase.auth.signInWithPassword({
          email: registerFormData.email,
          password: registerFormData.password,
        });
        
        setRegisterMessage({ type: 'success', text: 'Account created and logged in successfully!' });
        router.push('/dashboard');
      }
    } catch (error) {
      setRegisterMessage({ type: 'error', text: 'An unexpected error occurred' });
      console.error('Registration error:', error);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[--background] to-[--border] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[--background] to-[--border] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[--surface] rounded-xl shadow-lg overflow-hidden border border-[--border]">
        <div className="p-6">
          <div className="flex flex-col items-center mb-10">
            <div className="p-6 bg-[--background] rounded-full mb-6 shadow-md" style={{ background: 'linear-gradient(135deg, #00C389, #0073CE, #003D73)' }}>
              <Logo size={120} showText={false} className="animate-pulse" />
            </div>
            <p className="text-[--text-secondary] mt-2 text-lg">Sign in to continue</p>
          </div>
          
          <AuthTabs
            tabs={[
              { id: 'login', label: 'Login' },
              { id: 'register', label: 'Register' },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'login' | 'register')}
          />
          
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                id="login-email"
                type="email"
                name="email"
                required
                value={loginFormData.email}
                onChange={handleLoginChange}
                placeholder="your@email.com"
                error={loginErrors.email}
              />              <Input
                label="Password"
                id="login-password"
                type="password"
                name="password"
                required
                value={loginFormData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                error={loginErrors.password}
                className="text-[#0A1A2F] border-2"
                style={{ color: '#0A1A2F', borderWidth: '2px' }}
              />
              
              {loginMessage && (
                <div className={`p-3 rounded-lg ${
                  loginMessage.type === 'success' ? 'bg-[--accent]/10 text-[--accent]' : 'bg-red-100 text-red-800'
                }`}>
                  {loginMessage.text}
                </div>
              )}
              
              <Button
                type="submit"
                isLoading={isLoginLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Email"
                id="register-email"
                type="email"
                name="email"
                required
                value={registerFormData.email}
                onChange={handleRegisterChange}
                placeholder="your@email.com"
                error={registerErrors.email}
              />              <Input
                label="Password"
                id="register-password"
                type="password"
                name="password"
                required
                value={registerFormData.password}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                error={registerErrors.password}
                className="text-[#0A1A2F] border-2"
                style={{ color: '#0A1A2F', borderWidth: '2px' }}
              />
              
              {registerMessage && (
                <div className={`p-3 rounded-lg ${
                  registerMessage.type === 'success' ? 'bg-[--accent]/10 text-[--accent]' : 'bg-red-100 text-red-800'
                }`}>
                  {registerMessage.text}
                </div>
              )}
              
              <Button
                type="submit"
                isLoading={isRegisterLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          )}
        </div>
        
        <div className="px-6 py-4 bg-[--background] border-t border-[--border]">
          <p className="text-center text-[--text-secondary] text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
