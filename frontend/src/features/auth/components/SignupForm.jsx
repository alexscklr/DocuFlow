import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithPasswordAndProfile } from "../lib/authQueries";

export const SignupForm = () => {
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        const displayName = form.get("display_name");

        setLoading(true);
        setError(null);
        setInfo(null);

        const { error } = await signUpWithPasswordAndProfile(email, password, {
            displayName,
        });
        setLoading(false);

        if (error) {
            console.error("Signup error:", error);
            setError(error);
            return;
        }

        setInfo(
            "Registration successful. Check your inbox for confirmation details."
        );
        navigate("/");
    };

    return (
        <section className="w-full max-w-md mx-auto space-y-10 text-center flex gap-5 flex-col">
            <header className="space-y-4">
                <p className="text-sm leading-relaxed">
                    Set up your profile to collaborate across teams and documents.
                </p>
            </header>

            <form
                onSubmit={handleSignupSubmit}
                className="glass p-9 space-y-7 rounded-2xl text-left w-full flex flex-col gap-5"
                aria-busy={loading}
            >
                <label htmlFor="display_name" className="block space-y-3">
                    <span className="text-xs font-semibold tracking-wide">
                        Display name
                    </span>
                    <input
                        type="text"
                        id="display_name"
                        name="display_name"
                        placeholder="e.g. Taylor Jenkins"
                        className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    />
                </label>

                <label htmlFor="email" className="block space-y-3">
                    <span className="text-xs font-semibold tracking-wide">
                        Work email
                    </span>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    />
                </label>

                <label htmlFor="password" className="block distance-bottom-md">
                    <span className="text-xs font-semibold tracking-wide ">
                        Password
                    </span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    />
                </label>

                {error && (
                    <div className="glass border border-red-500/40 bg-red-500/10 text-sm px-3 py-2 rounded" style={{ color: 'var(--color-text)' }}>
                        {error.message}
                    </div>
                )}

                {info && (
                    <div className="glass border border-emerald-500/40 bg-emerald-500/10 text-sm px-3 py-2 rounded" style={{ color: 'var(--color-text)' }}>
                        {info}
                    </div>
                )}

                <button
                    type="submit"
                    className="glass-btn w-40 mx-auto flex self-center justify-center px-4 py-2"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>
        </section>
    );
};
