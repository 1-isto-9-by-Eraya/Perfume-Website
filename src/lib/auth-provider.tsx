// lib/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { isAllowedEmail } from '@/lib/acl';

interface AuthContextType {
  isAuthorized: boolean;
  isLoading: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  isLoading: true,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const protectedRoutes = ['/dashboard', '/blog/new', '/reviews'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.email) {
      const authorized = isAllowedEmail(session.user.email);
      setIsAuthorized(authorized);
      
      // If on protected route and not authorized, handle it
      if (isProtectedRoute && !authorized) {
        // Sign them out and show unauthorized popup
        signOut({ redirect: false }).then(() => {
          router.push('/blog?unauthorized=1');
        });
      }
    } else {
      setIsAuthorized(false);
      
      // If on protected route and not signed in, redirect to sign in
      if (isProtectedRoute) {
        router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }
    
    setHasChecked(true);
  }, [session, status, pathname, isProtectedRoute, router]);

  const value = {
    isAuthorized,
    isLoading: status === 'loading' || !hasChecked,
    user: session?.user || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);