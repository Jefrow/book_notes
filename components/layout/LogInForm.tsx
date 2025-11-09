import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { loginUser } from "../../Routes/Api";

function LogIn() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const data = await loginUser({ user_email: email, password });
      setUser?.(data.user);
      navigate("/UserReviews");
    } catch (err: any) {
      setError(err?.message || "Login Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-5"
    >
      <h1 className="text-lg/12 text-center front-semibold text-black">
        Log In
      </h1>
      <div>
        <label htmlFor="email">User Name:</label>
        <input
          type="text"
          name="user_email"
          id="user_email"
          className="w-full p-2 rounded shadow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div>
        <label htmlFor="User Password">User Password:</label>
        <input
          type="text"
          name="password"
          id="password"
          className="w-full p-2 rounded shadow"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="cursor-pointer bg-blue-500 text-black shadow px-4 py-2 p-4 rounded-lg mx-auto flex justify-center"
        disabled={submitting}
      >
        {submitting ? "Logging in...." : "Log In"}
      </button>
      <p className="text-center">
        Don't have an account?{" "}
        <Link
          className="text-blue-600 underline hover:text-blue-800"
          to="/Register"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LogIn;
