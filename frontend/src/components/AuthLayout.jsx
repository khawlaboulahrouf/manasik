
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Star, MoonStar, Plane } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-cream lg:grid lg:grid-cols-2">

            {/* Partie gauche */}
            <div className="relative hidden min-h-screen overflow-hidden bg-brand-dark lg:flex lg:flex-col lg:justify-between p-12 xl:p-16">

                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=85')",
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#043d31]/65 via-[#043d31]/50 to-[#032b23]" />

                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full border border-white/15" />
                <div className="absolute -right-24 top-1/3 h-64 w-64 rounded-full border border-white/15" />

                {/* Logo */}
                <Link to="/" className="relative z-10 flex items-center gap-3 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/50 bg-white/10">
                        <MoonStar size={25} className="text-[#e9cb8d]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold tracking-[0.16em]">MANASIK</p>
                        <p className="text-[10px] tracking-[0.24em] text-white/65">
                            OMRA & HAJJ
                        </p>
                    </div>
                </Link>

                {/* Texte principal */}
                <div className="relative z-10 max-w-lg animate-fade-up">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e9cb8d]/40 bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-[#e9cb8d]">
                        <Star size={13} />
                        VOTRE VOYAGE SPIRITUEL
                    </div>

                    <h2 className="font-serif text-5xl leading-[1.15] font-medium text-white xl:text-6xl">
                        Un voyage sacré,
                        <br />
                        <span className="italic text-[#e9cb8d]">
                            une expérience
                        </span>
                        <br />
                        inoubliable.
                    </h2>

                    <p className="mt-7 max-w-md text-base leading-8 text-white/75">
                        Découvrez nos programmes Omra & Hajj et préparez
                        votre voyage spirituel avec sérénité.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-5 text-sm text-white/85">
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-[#e9cb8d]" />
                            Réservation accompagnée
                        </span>
                        <span className="flex items-center gap-2">
                            <Plane size={18} className="text-[#e9cb8d]" />
                            Offres personnalisées
                        </span>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-white/50">
                    © {new Date().getFullYear()} MANASIK. Tous droits réservés.
                </p>
            </div>

            {/* Partie droite */}
            <div className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-14 xl:px-24">

                {/* Mobile logo */}
                <div className="flex items-center justify-between lg:justify-end">
                    <Link to="/" className="flex items-center gap-2 lg:hidden">
                        <MoonStar className="text-brand" size={27} />
                        <span className="text-xl font-bold tracking-widest text-brand">
                            MANASIK
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
                    >
                        <ArrowLeft size={16} />
                        Accueil
                    </Link>
                </div>

                <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-12 animate-fade-up">
                    <div className="mb-8">
                        <div className="mb-6 h-1 w-12 rounded-full bg-gold" />
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                            Bienvenue chez Manasik
                        </p>
                        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#183b31] sm:text-[43px]">
                            {title}
                        </h1>
                        <p className="mt-3 text-sm leading-7 text-gray-500">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>

                <div className="text-center text-xs text-gray-400">
                    Votre sérénité, notre priorité.
                </div>
            </div>
        </div>
    );
}
