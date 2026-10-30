
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reservationService } from "../services/reservationService";

function Packages() {
  const { token, user } = useAuth();

  const [packages, setPackages] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setError("");

        const [packagesData, departuresData] = await Promise.all([
          reservationService.getPackages(token),
          reservationService.getDepartures(token),
        ]);

        if (!active) return;

        setPackages(
          Array.isArray(packagesData)
            ? packagesData
            : packagesData.data ?? []
        );

        setDepartures(
          Array.isArray(departuresData)
            ? departuresData
            : departuresData.data ?? []
        );
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("Veuillez vous connecter pour consulter les voyages.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [token]);

  const handleBooking = async (departure) => {
    const confirmed = window.confirm(
      `Confirmer votre demande de réservation pour ${
        departure.package?.titre || "ce voyage"
      } au prix de ${departure.prix} DH ?`
    );

    if (!confirmed) return;

    setBookingId(departure.id);
    setError("");
    setSuccess("");

    try {
      const result = await reservationService.create(token, departure.id);
      setSuccess(
        result.message || "Votre demande de réservation a été envoyée."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingId(null);
    }
  };

  const isClient = user?.role === "client";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F1]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="mt-4 text-sm font-medium text-emerald-900">
            Préparation de vos voyages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-emerald-950/10 bg-[#FAF8F1]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/client" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-900 text-xl text-amber-300 shadow-lg shadow-emerald-950/10">
              م
            </span>
            <span>
              <span className="block text-xl font-black tracking-[0.18em] text-emerald-950">
                MANASIK
              </span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-amber-700">
                VOYAGES SPIRITUELS
              </span>
            </span>
          </Link>

          <Link
            to="/client"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-3 py-2 text-xs font-semibold text-emerald-950 transition hover:border-emerald-800 hover:bg-emerald-50 sm:px-4 sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            <span>Tableau de bord</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-10 text-white shadow-2xl shadow-emerald-950/15 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border border-amber-300/20" />
          <div className="absolute -right-8 -top-12 -z-10 h-52 w-52 rounded-full border border-amber-300/20" />
          <div className="absolute -bottom-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-emerald-800/50 blur-3xl" />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold tracking-wide text-amber-200 sm:text-sm">
              <span>✦</span>
              VOTRE VOYAGE, UNE EXPÉRIENCE SPIRITUELLE
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Le voyage du cœur
              <span className="mt-2 block text-amber-300">
                commence ici.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-100 sm:text-base sm:leading-8">
              Découvrez nos formules Omra et Hajj, consultez les dates de
              départ et choisissez le voyage qui correspond à vos attentes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <a
                href="#offres"
                className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-6 py-3 font-bold text-emerald-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-amber-200"
              >
                Explorer les offres <span className="ml-2">↓</span>
              </a>

              <Link
                to="/client/reservations"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Mes réservations
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-emerald-100 sm:mt-12">
            <span><span className="mr-2 text-amber-300">✦</span>Omra & Hajj</span>
            <span><span className="mr-2 text-amber-300">✦</span>Dates de départ</span>
            <span><span className="mr-2 text-amber-300">✦</span>Réservation en ligne</span>
          </div>
        </section>

        <section id="offres" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
                Nos destinations spirituelles
              </p>
              <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
                Choisissez votre voyage
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Explorez les formules disponibles et retrouvez toutes les
                informations utiles avant de réserver.
              </p>
            </div>

            <span className="w-fit rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-medium text-emerald-900">
              {packages.length} {packages.length > 1 ? "formules" : "formule"}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <span className="text-lg">!</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
            >
              <span className="text-lg">✓</span>
              <div>
                <p className="font-bold">Demande envoyée</p>
                <p className="mt-1">{success}</p>
                {isClient && (
                  <Link
                    to="/client/reservations"
                    className="mt-3 inline-block font-bold underline underline-offset-4"
                  >
                    Consulter mes réservations
                  </Link>
                )}
              </div>
            </div>
          )}

          {packages.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-emerald-900/20 bg-white px-6 py-14 text-center sm:px-10">
              <span className="text-5xl">🕋</span>
              <h3 className="mt-5 text-xl font-bold text-emerald-950">
                Nos prochaines offres arrivent bientôt
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Aucune formule n'est disponible pour le moment. Revenez
                prochainement pour découvrir nos voyages.
              </p>
              <Link
                to="/client"
                className="mt-6 inline-flex rounded-xl bg-emerald-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Retour au tableau de bord
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((item) => {
                const packageDepartures = departures.filter(
                  (departure) =>
                    Number(departure.package_id) === Number(item.id)
                );

                return (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-emerald-950/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300/70 hover:shadow-xl hover:shadow-emerald-950/10"
                  >
                    <div className="relative flex min-h-48 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.titre}
                          className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border border-amber-300/20" />
                          <div className="absolute -right-2 -top-4 h-28 w-28 rounded-full border border-amber-300/20" />
                          <span className="absolute bottom-3 right-5 text-6xl text-white/10">
                            ✦
                          </span>
                        </>
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-amber-200/30 bg-black/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-sm">
                          {item.type || "Voyage"}
                        </span>
                        <span className="text-xl text-amber-300">✧</span>
                      </div>

                      <div className="relative z-10 mt-8">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-100">
                          Votre prochaine étape
                        </p>
                        <h3 className="mt-2 text-2xl font-bold leading-snug">
                          {item.titre}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                        {item.description || "Découvrez les détails de cette formule de voyage."}
                      </p>

                      <div className="mb-4 mt-6 flex items-center justify-between border-b border-slate-100 pb-4">
                        <h4 className="font-bold text-emerald-950">
                          Départs disponibles
                        </h4>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {packageDepartures.length}
                        </span>
                      </div>

                      {packageDepartures.length === 0 ? (
                        <p className="rounded-xl bg-[#FAF8F1] p-4 text-sm leading-6 text-slate-500">
                          Aucun départ disponible pour cette formule.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {packageDepartures.map((departure) => (
                            <div
                              key={departure.id}
                              className="rounded-2xl border border-emerald-900/10 bg-[#FCFBF7] p-4 transition hover:border-emerald-900/25"
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                <span className="text-base">◷</span>
                                Dates du voyage
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-slate-500">Départ</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {departure.date_depart}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Retour</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {departure.date_retour}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-200 pt-4">
                                <div>
                                  <p className="text-xs text-slate-500">Prix par personne</p>
                                  <p className="mt-1 text-2xl font-black text-emerald-950">
                                    {Number(departure.prix).toLocaleString("fr-FR")}
                                    <span className="ml-1 text-sm font-semibold">DH</span>
                                  </p>
                                </div>
                                <span className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                  {departure.capacite} places
                                </span>
                              </div>

                              {isClient && (
                                <button
                                  type="button"
                                  onClick={() => handleBooking(departure)}
                                  disabled={bookingId !== null}
                                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-950/10 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {bookingId === departure.id ? (
                                    <>
                                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                      Envoi en cours...
                                    </>
                                  ) : (
                                    <>Réserver ce voyage <span>→</span></>
                                  )}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-5">
                        <p className="text-center text-xs leading-5 text-slate-400">
                          Un voyage préparé avec soin, pour un esprit serein.
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-amber-200/70 bg-gradient-to-r from-white to-amber-50/70 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Besoin de retrouver votre demande ?
            </p>
            <h2 className="mt-2 text-xl font-bold text-emerald-950">
              Votre voyage, en toute tranquillité
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consultez le statut de vos demandes depuis votre espace personnel.
            </p>
          </div>

          <Link
            to="/client/reservations"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-900/15 bg-white px-5 py-3 text-sm font-bold text-emerald-950 shadow-sm transition hover:border-emerald-800 hover:bg-emerald-50"
          >
            Mes réservations <span className="ml-2">→</span>
          </Link>
        </section>
      </main>

      <footer className="border-t border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-10">
          <span className="font-black tracking-[0.2em] text-emerald-950">
            MANASIK
          </span>
          <span>Des voyages spirituels préparés avec soin.</span>
        </div>
      </footer>
    </div>
  );
}

export default Packages;
