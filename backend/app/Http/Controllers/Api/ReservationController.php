<?php

namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;
use App\Models\Departure;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // Les réservations du client connecté
    public function index(Request $request)
    {
        $reservations = Reservation::with(['departure.package'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    // Créer une réservation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'departure_id' => 'required|exists:departures,id',
        ]);

        $reservation = DB::transaction(function () use ($request, $validated) {
            $departure = Departure::whereKey($validated['departure_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $placesReservees = Reservation::where(
                'departure_id',
                $departure->id
            )
                ->whereIn('statut', ['en_attente', 'confirmee'])
                ->count();

            if ($placesReservees >= $departure->capacite) {
                abort(422, 'Il ne reste plus de places pour ce départ.');
            }

            return Reservation::create([
                'user_id' => $request->user()->id,
                'departure_id' => $departure->id,
                'montant_total' => $departure->prix,
                'statut' => 'en_attente',
            ]);
        });

        return response()->json([
            'message' => 'Votre réservation a été créée avec succès.',
            'reservation' => $reservation->load('departure.package'),
        ], 201);
    }

    // Toutes les réservations pour l'administrateur
    public function adminIndex()
    {
        $reservations = Reservation::with([
            'user',
            'departure.package',
        ])->latest()->get();

        return response()->json($reservations);
    }

    // Modifier le statut d'une réservation
    public function updateStatus(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'statut' => 'required|in:en_attente,confirmee,annulee',
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'reservation' => $reservation->load([
                'user',
                'departure.package',
            ]),
        ]);
    }
}

