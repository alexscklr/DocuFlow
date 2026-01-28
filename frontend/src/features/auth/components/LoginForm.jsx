import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPassword } from "../lib/authQueries";

export const LoginForm = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    const { data: authData, error } = await signInWithPassword(email, password);
    if (error) {
      console.error("Login error:", error);
      setError(error);
    } else {
      console.log("Login successful:", authData);
      setError(null);
      navigate("/");
    }
  };

  return (
    <section className="w-full max-w-md mx-auto space-y-10 text-center flex gap-5 flex-col">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em]">
          Welcome back
        </p>
      </header>

      <form
        onSubmit={handleLoginSubmit}
        className="glass p-9 space-y-7 rounded-2xl text-left w-full flex flex-col gap-5"
      >
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
          <span className="text-xs font-semibold tracking-wide">
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

        <button
          type="submit"
          className="glass-btn w-40 mx-auto flex self-center justify-center px-4 py-2"
        > 
          Sign in
        </button>
      </form>
    </section>
  );
};
