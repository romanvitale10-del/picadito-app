import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' o 'register'

  return (
    <div className="min-h-screen flex items-center justify-center bg-grass-pattern px-4 py-8">
      <div className="w-full max-w-md fade-in">
        {mode === 'login' ? (
          <LoginForm onToggleMode={() => setMode('register')} />
        ) : (
          <RegisterForm onToggleMode={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
