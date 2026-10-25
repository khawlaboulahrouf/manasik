
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-gray-800">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:px-10">
        <a href="/client" className="text-xl font-bold text-emerald-800">
          MANASIK
        </a>

        <LogoutButton />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-12">
        <section className="rounded-2xl bg-emerald-900 p-6 text-white md:p-10">
          <p className="mb-3 text-sm text-emerald-100">
            Bienvenue sur MANASIK
          </p>

          <h1 className="text-2xl font-bold md:text-4xl">
            Salam {user?.name || "cher voyageur"} !
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 md:text-base">
            Préparez votre prochain voyage spirituel en toute sérénité.
            Découvrez nos offres Omra et Hajj.
          </p>

          <a
            href="#offres"
            className="mt-6 inline-block rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-emerald-950 hover:bg-amber-300"
          >
            Découvrir les offres
          </a>
        </section>

        <section id="offres" className="py-10">
          <h2 className="text-xl font-bold md:text-2xl">
            Nos voyages spirituels
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Découvrez nos prochaines offres Omra et Hajj.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <span className="text-2xl">🕋</span>
              <h3 className="mt-3 font-bold">Voyages Omra</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Préparez votre Omra et consultez les formules disponibles.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <span className="text-2xl">🌙</span>
              <h3 className="mt-3 font-bold">Voyages Hajj</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Retrouvez les informations sur les prochains départs Hajj.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <span className="text-2xl">📋</span>
              <h3 className="mt-3 font-bold">Mes réservations</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Retrouvez ici vos demandes et vos réservations.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
