import { signUpWithPasswordAndProfile } from "../lib/authQueries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {

    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get('email');
        const password = form.get('password');
        const displayName = form.get('display_name');

        setLoading(true);
        setError(null);
        setInfo(null);

        const { error } = await signUpWithPasswordAndProfile(email, password, { displayName });
        setLoading(false);

        if (error) {
            console.error('Signup error:', error);
            setError(error);
            return;
        }

        // Erfolgreich: Profil via RPC erstellt (auch ohne Session möglich)
        setInfo('Registrierung erfolgreich. Bitte prüfe ggf. deine E-Mails zur Bestätigung.');
        navigate('/');
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
                <label htmlFor="display_name">Display Name:</label>
                <input type="text" id="display_name" name="display_name" placeholder="Dein Anzeigename" />
            </div>
            {/* Avatar Upload entfällt vorerst; Default-Avatar wird serverseitig gesetzt */}
            <div>
                {error && <p style={{ color: 'red' }}>{error.message}</p>}
                {info && <p style={{ color: 'green' }}>{info}</p>}
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Registriere…' : 'Sign up'}</button>
        </form>
    );
}