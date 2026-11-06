
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { reservationService } from "../../services/reservationService";
import LogoutButton from "../../components/LogoutButton";

const statusLabels = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

export default function AdminReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  const fetchReservations = async () => {
    try {
      setError("");
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/reservations",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les réservations.");
      }

      setReservations(
        Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []
      );
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    } else {
      setError("Veuillez vous connecter.");
      setLoading(false);
    }
  }, [token]);

  const updateStatus = async (id, statut) => {
    setUpdatingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statut }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le statut.");
      }

      setSuccess("Le statut de la réservation a été modifié.");
      await fetchReservations();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const searchValue = search.toLowerCase().trim();

    const clientName = reservation.user?.name?.toLowerCase() || "";
    const clientEmail = reservation.user?.email?.toLowerCase() || "";
    const reservationId = String(reservation.id);

    const matchesSearch =
      clientName.includes(searchValue) ||
      clientEmail.includes(searchValue) ||
      reservationId.includes(searchValue);

    const matchesStatus =
      statusFilter === "tous" ||
      reservation.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <Link to="/admin" className="text-2xl font-bold text-emerald-800">
          MANASIK
        </Link>
        <LogoutButton />
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <Link
          to="/admin"
          className="mb-5 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Retour au dashboard
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Gestion des réservations
        </h1>
        <p className="mb-6 text-gray-600">
          Consultez les demandes des clients et gérez leur statut.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-4 text-emerald-800">
            {success}
          </p>
        )}

        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Rechercher une réservation
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, email ou numéro de réservation..."
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Filtrer par statut
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-emerald-600"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmées</option>
                <option value="annulee">Annulées</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <p className="rounded-xl bg-white p-6">Chargement des réservations...</p>
        ) : reservations.length === 0 && !error ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">Aucune réservation pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <p className="p-4 text-sm text-gray-600">
              {filteredReservations.length} réservation(s) trouvée(s)
            </p>
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="p-4">N°</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Voyage</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-t border-gray-100">
                    <td className="p-4 font-medium">#{reservation.id}</td>

                    <td className="p-4">
                      <p className="font-medium text-gray-800">
                        {reservation.user?.name || "Client"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.user?.email || "—"}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-gray-800">
                        {reservation.departure?.package?.titre || "Voyage"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Départ : {reservation.departure?.date_depart || "—"}
                      </p>
                    </td>

                    <td className="p-4 font-semibold text-emerald-800">
                      {reservation.montant_total ?? "—"} DH
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                        {statusLabels[reservation.statut] || reservation.statut}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        aria-label={`Statut de la réservation ${reservation.id}`}
                        value={reservation.statut}
                        disabled={updatingId === reservation.id}
                        onChange={(e) =>
                          updateStatus(reservation.id, e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white p-2 text-sm disabled:opacity-50"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Aucune réservation trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
