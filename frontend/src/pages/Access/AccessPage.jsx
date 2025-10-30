import { useState } from 'react';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { SignupForm } from '../../features/auth/components/SignupForm';

export const AccessPage = () => {
    const [accessType, setAccessType] = useState('login');


   

    if (accessType === 'login') {
        return (
            <div>
                <h2>Login Page</h2>
                <LoginForm />
                <button onClick={() => setAccessType('signup')}>Go to Signup</button>
            </div>
        );
    }
    if (accessType === 'signup') {
        return (
            <div>
                <h2>Signup Page</h2>
                <SignupForm />
                <button onClick={() => setAccessType('login')}>Go to Login</button>
            </div>
        );
    }
}