
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { reservationService } from "../../services/reservationService";
import LogoutButton from "../../components/LogoutButton";

export default function MyReservations() {
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationService.getMyReservations(token);
        setReservations(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReservations();
    } else {
      setError("Veuillez vous connecter.");
      setLoading(false);
    }
  }, [token]);

  const statusStyles = {
    en_attente: "bg-amber-100 text-amber-800",
    confirmee: "bg-emerald-100 text-emerald-800",
    annulee: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <Link to="/client" className="text-2xl font-bold text-emerald-800">
          MANASIK
        </Link>
        <LogoutButton />
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Mes réservations
        </h1>
        <p className="mb-6 text-gray-600">
          Consultez vos demandes et le statut de vos voyages.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p>Chargement de vos réservations...</p>
        ) : reservations.length === 0 && !error ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="mb-4 text-gray-600">
              Vous n'avez pas encore de réservation.
            </p>
            <Link
              to="/packages"
              className="inline-block rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Découvrir les offres
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase text-amber-700">
                      {reservation.departure?.package?.type || "Voyage"}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-800">
                      {reservation.departure?.package?.titre ||
                        "Voyage réservé"}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      statusStyles[reservation.statut] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {reservation.statut?.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-gray-600">
                  <p>
                    Départ :{" "}
                    {reservation.departure?.date_depart || "Non disponible"}
                  </p>
                  <p>
                    Retour :{" "}
                    {reservation.departure?.date_retour || "Non disponible"}
                  </p>
                  <p className="pt-2 text-lg font-bold text-emerald-800">
                    {reservation.montant_total} DH
                  </p>
                  <p className="text-sm text-gray-500">
                    Réservation n° {reservation.id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
