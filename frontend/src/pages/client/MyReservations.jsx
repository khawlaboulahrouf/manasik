
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { reservationService } from "../../services/reservationService";
import LogoutButton from "../../components/LogoutButton";

const statusConfig = {
  en_attente: {
    label: "En attente",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "◷",
  },
  confirmee: {
    label: "Confirmée",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: "✓",
  },
  annulee: {
    label: "Annulée",
    className: "border-red-200 bg-red-50 text-red-800",
    icon: "×",
  },
};

function formatDate(value) {
  if (!value) return "Non disponible";

  const date = new Date(`${value}`.slice(0, 10) + "T12:00:00");

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPrice(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return `${value ?? "—"} DH`;

  return `${amount.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} DH`;
}

export default function MyReservations() {
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchReservations = async () => {
      try {
        setError("");

        const data = await reservationService.getMyReservations(token);

        if (active) {
          setReservations(
            Array.isArray(data) ? data : data.data ?? []
          );
        }
      } catch (err) {
        if (active) setError(err.message || "Impossible de charger vos réservations.");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (token) {
      fetchReservations();
    } else {
      setError("Veuillez vous connecter pour consulter vos réservations.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [token]);

  const pendingCount = reservations.filter(
    (item) => item.statut === "en_attente"
  ).length;

  const confirmedCount = reservations.filter(
    (item) => item.statut === "confirmee"
  ).length;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/client" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-bold text-gold shadow-sm">
              م
            </span>
            <span>
              <span className="block text-lg font-black tracking-[0.16em] text-brand-dark">
                MANASIK
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                Votre voyage spirituel
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/packages"
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand-light sm:inline-flex"
            >
              Explorer les offres
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/client"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-muted transition hover:text-brand"
        >
          <span aria-hidden="true">←</span>
          Retour au tableau de bord
        </Link>

        <section className="relative mt-5 overflow-hidden rounded-[1.75rem] bg-brand-dark px-5 py-7 text-white shadow-xl shadow-brand-dark/10 sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-6 h-36 w-36 rounded-full border border-gold/20" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-brand opacity-70 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Votre espace personnel
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Mes réservations
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/85 sm:text-base">
                Retrouvez vos voyages, consultez leurs dates et suivez
                l'évolution de chaque demande en toute simplicité.
              </p>
            </div>

            <Link
              to="/packages"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-brand-dark transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Découvrir les voyages <span>→</span>
            </Link>
          </div>
        </section>

        <section
          aria-label="Résumé des réservations"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">Total des demandes</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg text-brand">
                ▤
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-brand-dark">
              {loading ? "—" : reservations.length}
            </p>
            <p className="mt-1 text-xs text-muted">Toutes vos réservations</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">En attente</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
                ◷
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-amber-700">
              {loading ? "—" : pendingCount}
            </p>
            <p className="mt-1 text-xs text-muted">Demandes à traiter</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">Confirmées</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                ✓
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-emerald-700">
              {loading ? "—" : confirmedCount}
            </p>
            <p className="mt-1 text-xs text-muted">Voyages confirmés</p>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-brand-dark sm:text-2xl">
                Historique de vos voyages
              </h2>
              <p className="mt-1 text-sm text-muted">
                Les détails de chaque réservation apparaissent ci-dessous.
              </p>
            </div>

            {!loading && !error && reservations.length > 0 && (
              <span className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted">
                {reservations.length} résultat(s)
              </span>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              <p className="font-bold">Chargement impossible</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-line bg-white p-6"
                >
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="mt-4 h-6 w-2/3 rounded bg-slate-100" />
                  <div className="mt-7 h-20 rounded-xl bg-slate-100" />
                  <div className="mt-5 h-8 w-1/3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : !error && reservations.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-emerald-900/20 bg-white px-5 py-12 text-center sm:px-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-3xl">
                🕋
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-dark">
                Votre prochain voyage commence ici
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                Vous n'avez pas encore de réservation. Découvrez les formules
                disponibles et choisissez les dates qui vous conviennent.
              </p>
              <Link
                to="/packages"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Explorer les offres <span>→</span>
              </Link>
            </div>
          ) : !error ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {reservations.map((reservation) => {
                const status =
                  statusConfig[reservation.statut] || {
                    label: reservation.statut || "Inconnu",
                    className: "border-slate-200 bg-slate-50 text-slate-700",
                    icon: "•",
                  };

                const travelPackage = reservation.departure?.package;

                return (
                  <article
                    key={reservation.id}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-line bg-gradient-to-r from-white to-emerald-50/50 p-5 sm:p-6">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                          {travelPackage?.type || "Voyage spirituel"}
                        </p>
                        <h3 className="mt-2 break-words text-lg font-bold text-brand-dark sm:text-xl">
                          {travelPackage?.titre || "Voyage réservé"}
                        </h3>
                        <p className="mt-2 text-xs text-muted">
                          Réservation n° {reservation.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                      >
                        <span aria-hidden="true">{status.icon}</span>
                        {status.label}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-cream p-4">
                          <p className="text-xs font-medium text-muted">
                            Date de départ
                          </p>
                          <p className="mt-2 text-sm font-bold text-brand-dark">
                            {formatDate(reservation.departure?.date_depart)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-cream p-4">
                          <p className="text-xs font-medium text-muted">
                            Date de retour
                          </p>
                          <p className="mt-2 text-sm font-bold text-brand-dark">
                            {formatDate(reservation.departure?.date_retour)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-dashed border-line pt-5">
                        <div>
                          <p className="text-xs font-medium text-muted">
                            Montant de la réservation
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-brand">
                            {formatPrice(reservation.montant_total)}
                          </p>
                        </div>

                        <Link
                          to="/packages"
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand-light"
                        >
                          Voir les offres <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-black tracking-[0.18em] text-brand-dark">
            MANASIK
          </span>
          <span>Votre voyage spirituel, organisé en toute sérénité.</span>
          <Link
            to="/client"
            className="font-semibold text-brand transition hover:text-brand-dark"
          >
            Retour au tableau de bord ↑
          </Link>
        </footer>
      </main>
    </div>
  );
}
