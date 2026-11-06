
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

export default function AdminDashboard() {
  const { token } = useAuth();

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/admin/statistics",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de charger les statistiques."
          );
        }

        if (active) {
          setStatistics(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Une erreur est survenue.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchStatistics();
    } else {
      setError("Veuillez vous connecter.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [token]);

  const statsCards = [
    {
      title: "Total réservations",
      value: statistics?.total_reservations,
      icon: "📋",
    },
    {
      title: "En attente",
      value: statistics?.reservations_en_attente,
      icon: "⏳",
    },
    {
      title: "Confirmées",
      value: statistics?.reservations_confirmees,
      icon: "✅",
    },
    {
      title: "Annulées",
      value: statistics?.reservations_annulees,
      icon: "❌",
    },
    {
      title: "Total des offres",
      value: statistics?.total_packages,
      icon: "🕋",
    },
  ];

  const sections = [
    {
      title: "Gestion des offres",
      description:
        "Ajouter, modifier et supprimer les offres Omra et Hajj.",
      to: "/admin/packages",
      icon: "🕋",
    },
    {
      title: "Gestion des départs",
      description:
        "Gérer les dates de départ, de retour, les prix et les places disponibles.",
      to: "/admin/departures",
      icon: "✈️",
    },
    {
      title: "Gestion des réservations",
      description:
        "Consulter les réservations des clients et gérer leur statut.",
      to: "/admin/reservations",
      icon: "📋",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <Link to="/admin" className="text-2xl font-bold text-emerald-800">
          MANASIK
        </Link>

        <LogoutButton />
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Dashboard Admin
        </h1>

        <p className="mb-8 text-gray-600">
          Bienvenue dans votre espace de gestion des réservations Omra & Hajj.
        </p>

        {/* Statistiques */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Vue d'ensemble
          </h2>

          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statsCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <span className="text-2xl">{card.icon}</span>
                </div>

                <p className="text-3xl font-bold text-emerald-800">
                  {loading ? "..." : card.value ?? 0}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gestion */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Gestion de la plateforme
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.to}
                to={section.to}
                className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">{section.icon}</div>

                <h3 className="mb-2 text-xl font-semibold text-emerald-800">
                  {section.title}
                </h3>

                <p className="text-gray-600">
                  {section.description}
                </p>

                <span className="mt-5 inline-block font-semibold text-emerald-700">
                  Accéder →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
