
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-2xl font-bold text-emerald-800">
          MANASIK
        </h1>

        <LogoutButton />
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-800">
          Dashboard Admin
        </h2>

        <p className="mb-8 text-gray-600">
          Bienvenue dans votre espace de gestion des réservations Omra & Hajj.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            to="/admin/packages"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h3 className="mb-2 text-xl font-semibold text-emerald-800">
              Gestion des offres
            </h3>
            <p className="text-gray-600">
              Ajouter, modifier et supprimer les offres Omra et Hajj.
            </p>
          </Link>
          <Link
            to="/admin/departures"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h3 className="mb-2 text-xl font-semibold text-emerald-800">
              Gestion des départs
            </h3>
            <p className="text-gray-600">
              Gérer les dates de départ, de retour, les prix et les places disponibles.
            </p>
          </Link>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-2 text-xl font-semibold text-emerald-800">
              Gestion des réservations
            </h3>
            <p className="text-gray-600">
              Consulter et gérer les réservations des clients.
            </p>
            <span className="mt-3 inline-block text-sm text-gray-400">
              À développer
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
