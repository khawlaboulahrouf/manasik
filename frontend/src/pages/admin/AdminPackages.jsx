
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

const API_URL = "http://127.0.0.1:8000/api/packages";

export default function AdminPackages() {
    const { token } = useAuth();

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        titre: "",
        type: "omra",
        description: "",
        image: "",
    });

    const fetchPackages = async () => {
        try {
            setError("");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les offres.");
            }

            const data = await response.json();
            setPackages(Array.isArray(data) ? data : data.data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPackages();
        } else {
            setLoading(false);
            setError("Vous devez vous connecter.");
        }
    }, [token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const isEditing = editingId !== null;

            const response = await fetch(
                isEditing ? `${API_URL}/${editingId}` : API_URL,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        titre: form.titre,
                        type: form.type,
                        description: form.description,
                        image: form.image.trim() || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    throw new Error(Object.values(data.errors).flat().join(" "));
                }

                throw new Error(data.message || "Erreur lors de l'enregistrement.");
            }

            setForm({
                titre: "",
                type: "omra",
                description: "",
                image: "",
            });

            setEditingId(null);

            setSuccess(
                isEditing
                    ? "L'offre a été modifiée avec succès."
                    : "L'offre a été ajoutée avec succès."
            );

            await fetchPackages();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
                <Link to="/admin" className="text-2xl font-bold text-emerald-800">
                    MANASIK
                </Link>
                <LogoutButton />
            </header>

            <main className="mx-auto max-w-6xl space-y-8 p-6">
                <section>
                    <h1 className="mb-2 text-3xl font-bold text-gray-800">
                        Gestion des offres
                    </h1>
                    <p className="text-gray-600">
                        Ajoutez et consultez les offres Omra et Hajj.
                    </p>
                </section>

                <section className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-5 text-xl font-bold text-gray-800">
                        Ajouter une offre
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="titre" className="mb-1 block font-medium">
                                Titre de l'offre
                            </label>
                            <input
                                id="titre"
                                name="titre"
                                type="text"
                                value={form.titre}
                                onChange={handleChange}
                                required
                                maxLength={255}
                                className="w-full rounded-lg border border-gray-300 p-3"
                                placeholder="Ex : Omra Ramadan 2027"
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="mb-1 block font-medium">
                                Type de voyage
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 p-3"
                            >
                                <option value="omra">Omra</option>
                                <option value="hajj">Hajj</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block font-medium"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 p-3"
                                placeholder="Décrivez le programme du voyage..."
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="mb-1 block font-medium">
                                URL de l'image (facultatif)
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="url"
                                value={form.image}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-3"
                                placeholder="https://exemple.com/image.jpg"
                            />
                        </div>

                        {error && (
                            <p className="rounded-lg bg-red-50 p-3 text-red-700">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="rounded-lg bg-green-50 p-3 text-green-700">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                            {saving
                                ? "Enregistrement..."
                                : editingId
                                    ? "Enregistrer les modifications"
                                    : "Ajouter l'offre"}

                        </button>
                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({
                                        titre: "",
                                        type: "omra",
                                        description: "",
                                        image: "",
                                    });
                                    setError("");
                                    setSuccess("");
                                }}
                                className="ml-3 rounded-lg border border-gray-300 px-4 py-3"
                            >
                                Annuler
                            </button>
                        )}
                    </form>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        Liste des offres
                    </h2>

                    {loading && <p>Chargement des offres...</p>}

                    {!loading && !error && packages.length === 0 && (
                        <p className="rounded-lg bg-white p-6 text-gray-600 shadow">
                            Aucune offre disponible pour le moment.
                        </p>
                    )}

                    {!loading && packages.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {packages.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-xl bg-white p-5 shadow"
                                >
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                                        {item.type?.toUpperCase()}
                                    </span>

                                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                                        {item.titre}
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        {item.description}
                                    </p>

                                    <p className="mt-4 text-sm text-gray-400">
                                        Référence : {item.id}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm({
                                                titre: item.titre,
                                                type: item.type,
                                                description: item.description,
                                                image: item.image || "",
                                            });

                                            setEditingId(item.id);
                                            setSuccess("");
                                            setError("");
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="mt-4 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const confirmed = window.confirm(
                                                `Voulez-vous vraiment supprimer l'offre "${item.titre}" ?`
                                            );

                                            if (!confirmed) return;

                                            setError("");
                                            setSuccess("");

                                            try {
                                                const response = await fetch(`${API_URL}/${item.id}`, {
                                                    method: "DELETE",
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                        Accept: "application/json",
                                                    },
                                                });

                                                const data = await response.json().catch(() => ({}));

                                                if (!response.ok) {
                                                    throw new Error(data.message || "Erreur lors de la suppression.");
                                                }

                                                if (editingId === item.id) {
                                                    setEditingId(null);
                                                    setForm({
                                                        titre: "",
                                                        type: "omra",
                                                        description: "",
                                                        image: "",
                                                    });
                                                }

                                                setSuccess("L'offre a été supprimée avec succès.");
                                                await fetchPackages();
                                            } catch (err) {
                                                setError(err.message);
                                            }
                                        }}
                                        className="ml-2 mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                                    >
                                        Supprimer
                                    </button>

                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
