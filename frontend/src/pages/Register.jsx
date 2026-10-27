
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound, Mail, LockKeyhole, Eye, EyeOff,
  ArrowRight, LoaderCircle
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", form);

      login(response.data.user, response.data.token);

      navigate("/client");
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(" ")
          : err.response?.data?.message || "Inscription impossible."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-sm text-gray-800 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <AuthLayout
      title="Rejoignez Manasik."
      subtitle="Créez votre compte et commencez à préparer votre voyage spirituel."
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-gray-700">
            Nom complet
          </label>
          <div className="relative">
            <UserRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="register-name"
              name="name"
              placeholder="Votre nom complet"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-gray-700">
            Adresse e-mail
          </label>
          <div className="relative">
            <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-gray-700">
            Mot de passe
          </label>
          <div className="relative">
            <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8 caractères minimum"
              minLength={8}
              value={form.password}
              onChange={handleChange}
              required
              className={inputClass}
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

        <div>
          <label htmlFor="register-confirm" className="mb-2 block text-sm font-semibold text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="register-confirm"
              name="password_confirmation"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirmez votre mot de passe"
              minLength={8}
              value={form.password_confirmation}
              onChange={handleChange}
              required
              className={inputClass}
            />
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
              Créer mon compte
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="pt-4 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-brand hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
