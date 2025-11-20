import { useState } from 'react';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { SignupForm } from '../../features/auth/components/SignupForm';

export const AccessPage = () => {
  const [accessType, setAccessType] = useState('login');
  const isLogin = accessType === 'login';

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">
            {isLogin ? 'Login Page' : 'Signup Page'}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-6">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <button
            type="button"
            className="glass-btn px-6"
            onClick={() => setAccessType(isLogin ? 'signup' : 'login')}
          >
            {isLogin ? 'Go to Signup' : 'Go to Login'}
          </button>
        </div>
      </div>
    </main>
  );
};
