
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";

const API_URL = "http://127.0.0.1:8000/api";

export default function AdminDepartures() {
    const { token } = useAuth();

    const [departures, setDepartures] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        package_id: "",
        date_depart: "",
        date_retour: "",
        prix: "",
        capacite: "",
    });

    const fetchData = async () => {
        try {
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };

            const [departuresResponse, packagesResponse] = await Promise.all([
                fetch(`${API_URL}/departures`, { headers }),
                fetch(`${API_URL}/packages`, { headers }),
            ]);

            if (!departuresResponse.ok || !packagesResponse.ok) {
                throw new Error("Impossible de charger les données.");
            }

            const departuresData = await departuresResponse.json();
            const packagesData = await packagesResponse.json();

            setDepartures(
                Array.isArray(departuresData)
                    ? departuresData
                    : departuresData.data ?? []
            );

            setPackages(
                Array.isArray(packagesData)
                    ? packagesData
                    : packagesData.data ?? []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
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
            const response = await fetch(
                editingId
                    ? `${API_URL}/departures/${editingId}`
                    : `${API_URL}/departures`,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        package_id: Number(form.package_id),
                        date_depart: form.date_depart,
                        date_retour: form.date_retour,
                        prix: Number(form.prix),
                        capacite: Number(form.capacite),
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (data.errors) {
                    throw new Error(Object.values(data.errors).flat().join(" "));
                }
                throw new Error(data.message || "Erreur lors de l'enregistrement.");
            }

            setForm({
                package_id: "",
                date_depart: "",
                date_retour: "",
                prix: "",
                capacite: "",
            });

            setEditingId(null);
            setSuccess(
                editingId
                    ? "Départ modifié avec succès."
                    : "Départ ajouté avec succès."
            );

            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };


    const handleEdit = (item) => {
        setEditingId(item.id);

        setForm({
            package_id: String(item.package_id),
            date_depart: item.date_depart,
            date_retour: item.date_retour,
            prix: String(item.prix),
            capacite: String(item.capacite),
        });

        setError("");
        setSuccess("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce départ ?")) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/departures/${id}`, {
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

            if (editingId === id) {
                setEditingId(null);
                setForm({
                    package_id: "",
                    date_depart: "",
                    date_retour: "",
                    prix: "",
                    capacite: "",
                });
            }

            setSuccess("Départ supprimé avec succès.");
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({
            package_id: "",
            date_depart: "",
            date_retour: "",
            prix: "",
            capacite: "",
        });
        setError("");
        setSuccess("");
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestion des départs
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Gérez les dates, les prix et les capacités des voyages.
                    </p>
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
                )}

                {success && (
                    <p className="rounded-lg bg-green-50 p-4 text-green-700">
                        {success}
                    </p>
                )}

                <section className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-5 text-xl font-bold text-gray-800">
                        {editingId ? "Modifier le départ" : "Ajouter un départ"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="package_id" className="mb-1 block font-medium">
                                Offre associée
                            </label>
                            <select
                                id="package_id"
                                name="package_id"
                                value={form.package_id}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 p-3"
                            >
                                <option value="">Choisir une offre</option>
                                {packages.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.titre} — {item.type?.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {packages.length === 0 && (
                                <p className="mt-1 text-sm text-amber-700">
                                    Ajoutez d'abord une offre dans Gestion des offres.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="date_depart" className="mb-1 block font-medium">
                                    Date de départ
                                </label>
                                <input
                                    id="date_depart"
                                    name="date_depart"
                                    type="date"
                                    value={form.date_depart}
                                    onChange={handleChange}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-3"
                                />
                            </div>

                            <div>
                                <label htmlFor="date_retour" className="mb-1 block font-medium">
                                    Date de retour
                                </label>
                                <input
                                    id="date_retour"
                                    name="date_retour"
                                    type="date"
                                    value={form.date_retour}
                                    onChange={handleChange}
                                    min={form.date_depart || new Date().toLocaleDateString("en-CA")}
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-3"
                                />
                            </div>

                            <div>
                                <label htmlFor="prix" className="mb-1 block font-medium">
                                    Prix (DH)
                                </label>
                                <input
                                    id="prix"
                                    name="prix"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.prix}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-3"
                                    placeholder="15000"
                                />
                            </div>

                            <div>
                                <label htmlFor="capacite" className="mb-1 block font-medium">
                                    Nombre de places
                                </label>
                                <input
                                    id="capacite"
                                    name="capacite"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={form.capacite}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-3"
                                    placeholder="40"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving || packages.length === 0}
                            className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                            {saving
                                ? "Enregistrement..."
                                : editingId
                                    ? "Enregistrer les modifications"
                                    : "Ajouter le départ"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="ml-3 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700"
                            >
                                Annuler
                            </button>
                        )}
                    </form>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        Liste des départs
                    </h2>

                    {loading && <p>Chargement des départs...</p>}

                    {!loading && departures.length === 0 && !error && (
                        <p className="rounded-lg bg-white p-6 text-gray-600 shadow">
                            Aucun départ disponible pour le moment.
                        </p>
                    )}

                    {!loading && departures.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {departures.map((item) => (
                                <article key={item.id} className="rounded-xl bg-white p-5 shadow">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                                        {item.package?.type?.toUpperCase() || "VOYAGE"}
                                    </span>

                                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                                        {item.package?.titre || `Départ #${item.id}`}
                                    </h3>

                                    <p className="mt-3 text-gray-600">
                                        Départ : {item.date_depart}
                                    </p>
                                    <p className="text-gray-600">
                                        Retour : {item.date_retour}
                                    </p>
                                    <p className="mt-2 font-semibold text-emerald-800">
                                        {item.prix} DH
                                    </p>
                                    <p className="text-gray-600">
                                        Capacité : {item.capacite} places
                                    </p>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    </div>

                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
