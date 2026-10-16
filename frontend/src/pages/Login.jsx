
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight, LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      navigate(response.data.user.role === "admin" ? "/admin" : "/client");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Heureux de vous revoir."
      subtitle="Connectez-vous à votre espace pour organiser votre prochain voyage."
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-gray-700">
            Adresse e-mail
          </label>
          <div className="relative">
            <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">
              Mot de passe
            </label>
          </div>

          <div className="relative">
            <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-12 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/15 transition duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <>
              Se connecter
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="pt-5 text-center text-sm text-gray-500">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="font-bold text-brand hover:underline">
            Créer un compte
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
