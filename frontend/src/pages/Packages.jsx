
import { useEffect, useState } from "react";

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/packages",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Impossible de charger les packages.");
        }

        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <p className="p-6">Chargement des packages...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Nos voyages Omra & Hajj
      </h1>

      {packages.length === 0 ? (
        <p>Aucun package disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white p-5 shadow"
            >
              <h2 className="mb-2 text-xl font-semibold">
                {item.titre}
              </h2>

              <p className="mb-2 text-sm font-medium uppercase text-amber-700">
                {item.type}
              </p>

              <p className="text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Packages;
