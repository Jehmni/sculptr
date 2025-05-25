'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { UserProvider } from './user-context';

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}

export function withAuth<T extends object>(Component: React.ComponentType<T & { user: User }>) {
  return function AuthProtected(props: T) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth');
        } else {
          setUser(session.user);
          setLoading(false);
        }
      };
      
      checkAuth();
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/auth');
        } else if (session) {
          setUser(session.user);
          setLoading(false);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      );
    }

    return user ? <Component {...props} user={user} /> : null;
  };
}
