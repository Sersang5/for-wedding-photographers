import { Suspense } from 'react';
import { AuthCallbackClient } from './auth-callback-client';

function CallbackFallback() {
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}