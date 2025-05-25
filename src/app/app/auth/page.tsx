"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        className="w-full rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-opacity-30 border-[--border] bg-[--surface] text-[--foreground] pr-10 placeholder:text-[--text-secondary]"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[--text-secondary] hover:text-[--primary] focus:outline-none"
        onClick={() => setShow((v) => !v)}
      >
        {show ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.1 2.1A9.956 9.956 0 0112 21c-2.21 0-4.26-.72-5.925-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0a9.956 9.956 0 01-1.125 4.575m-2.1 2.1A9.956 9.956 0 0112 21c-2.21 0-4.26-.72-5.925-1.95m-2.1-2.1A9.956 9.956 0 012.5 12c0-1.657.403-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c2.21 0 4.26.72 5.925 1.95" /></svg>
        )}
      </button>
    </div>
  );
}

function AuthCard({
  title,
  subtitle,
  onSubmit,
  loading,
  error,
  success,
  buttonText,
  children,
}: {
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  buttonText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[--surface] rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm flex flex-col gap-4 border border-[--border] hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-2xl font-bold mb-1 text-center text-[--primary-dark]">{title}</h2>
      {subtitle && <p className="text-sm text-[--text-secondary] text-center mb-2">{subtitle}</p>}
      {error && <div className="bg-red-100 text-red-700 rounded p-2 text-center text-sm">{error}</div>}
      {success && <div className="bg-[--accent]/10 text-[--accent] rounded p-2 text-center text-sm">{success}</div>}
      <form className="flex flex-col gap-4" onSubmit={onSubmit} autoComplete="on">
        {children}
        <button
          type="submit"
          className="w-full text-white text-lg font-semibold rounded-lg p-3 mt-2 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
          style={{ background: 'linear-gradient(135deg, #00C389, #0073CE)' }}
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      setLoginSuccess("Logged in! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    setRegLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
      });
      if (error) throw error;
      // Auto-login after registration
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: regEmail,
        password: regPassword,
      });
      if (loginError) throw loginError;
      setRegSuccess("Account created! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setRegError(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[--background] to-[--border] p-4">
      <div className="flex flex-col items-center mb-12">
        <div className="p-6 bg-[--surface] rounded-full mb-4 shadow-lg animate-pulse" style={{ background: 'linear-gradient(135deg, #00C389, #0073CE, #003D73)' }}>
          <img src="/logo.png" alt="Sculptr Logo" width="140" height="140" className="object-contain" />
        </div>
        <p className="text-[--text-secondary] text-center max-w-md text-lg">Welcome! Sign in to your account or create a new one to get started.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        <AuthCard
          title="Login"
          subtitle="Access your account"
          onSubmit={handleLogin}
          loading={loginLoading}
          error={loginError}
          success={loginSuccess}
          buttonText="Login"
        >          <div>
            <label className="block text-base font-medium mb-1 text-[--foreground]" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="w-full rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-opacity-30 border-[--border] bg-[--surface] text-[--foreground] placeholder:text-[--text-secondary]"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@email.com"
              required
            />
          </div>          <div>
            <label className="block text-base font-medium mb-1 text-[--foreground]" htmlFor="login-password">Password</label>
            <PasswordInput
              id="login-password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
            />
            <span className="text-xs text-[--text-secondary] mt-1 block">Minimum 6 characters</span>
          </div>
        </AuthCard>        <div className="flex flex-row md:flex-col items-center justify-center my-4 md:my-0">
          <div className="w-full md:w-px md:h-64 h-px bg-[--border]" />
          <span className="mx-4 md:mx-0 md:my-4 text-[--text-secondary] font-semibold text-sm select-none">or</span>
          <div className="w-full md:w-px md:h-64 h-px bg-[--border]" />
        </div>
        <AuthCard
          title="Register"
          subtitle="Create a new account"
          onSubmit={handleRegister}
          loading={regLoading}
          error={regError}
          success={regSuccess}
          buttonText="Register"
        >          <div>
            <label className="block text-base font-medium mb-1 text-[--foreground]" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className="w-full rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-opacity-30 border-[--border] bg-[--surface] text-[--foreground] placeholder:text-[--text-secondary]"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@email.com"
              required
            />
          </div>          <div>
            <label className="block text-base font-medium mb-1 text-[--foreground]" htmlFor="reg-password">Password</label>
            <PasswordInput
              id="reg-password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Create a password"
            />
            <span className="text-xs text-[--text-secondary] mt-1 block">Minimum 6 characters</span>
          </div>
        </AuthCard>
      </div>
    </div>
  );
} 