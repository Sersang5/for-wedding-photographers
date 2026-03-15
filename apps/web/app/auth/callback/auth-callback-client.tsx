'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function AuthCallbackClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const organizationId = searchParams.get('organizationId');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (userId) {
      localStorage.setItem('userId', userId);
    }

    if (email) {
      localStorage.setItem('email', email);
    }

    if (organizationId) {
      localStorage.setItem('organizationId', organizationId);
    }

    window.location.replace('/');
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white/85 p-6 text-center shadow-panel backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-brand-ink">
          Finalizando autenticacion...
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Te estamos redirigiendo al dashboard.
        </p>
      </section>
    </main>
  );
}