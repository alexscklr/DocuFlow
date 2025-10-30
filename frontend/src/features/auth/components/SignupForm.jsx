import { signUpWithPassword } from "../lib/authQueries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get('email');
        const password = form.get('password');

        const { data: authData, error } = await signUpWithPassword(email, password);
        if (error) {
            console.error('Signup error:', error);
            setError(error);
        } else {
            console.log('Signup successful:', authData);
            setError(null);
            navigate('/'); // Redirect to home page on successful signup
        }
    };

    return (
        <form onSubmit={handleSignupSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div>
                {error && <p style={{ color: 'red' }}>{error.message}</p>}
            </div>
            <button type="submit">Login</button>
        </form>
    );
}