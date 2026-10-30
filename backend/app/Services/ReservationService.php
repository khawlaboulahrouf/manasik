<?php

namespace App\Services;


use App\Models\Departure;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    public function create(User $user, int $departureId): Reservation
    {
        return DB::transaction(function () use ($user, $departureId) {
            $departure = Departure::query()
                ->whereKey($departureId)
                ->lockForUpdate()
                ->firstOrFail();

            $existingReservation = Reservation::query()
                ->where('user_id', $user->id)
                ->where('departure_id', $departure->id)
                ->whereIn('statut', ['en_attente', 'confirmee'])
                ->exists();

            if ($existingReservation) {
                throw ValidationException::withMessages([
                    'departure_id' => [
                        'Vous avez déjà une réservation pour ce départ.',
                    ],
                ]);
            }


            $placesReservees = Reservation::query()
                ->where('departure_id', $departure->id)
                ->whereIn('statut', ['en_attente', 'confirmee'])
                ->count();

            if ($placesReservees >= $departure->capacite) {
                throw ValidationException::withMessages([
                    'departure_id' => [
                        'Il ne reste plus de places pour ce départ.',
                    ],
                ]);
            }

            return Reservation::create([
                'user_id' => $user->id,
                'departure_id' => $departure->id,
                'montant_total' => $departure->prix,
                'statut' => 'en_attente',
            ]);
        });
    }

    public function updateStatus(
        Reservation $reservation,
        string $statut
    ): Reservation {
        $reservation->update([
            'statut' => $statut,
        ]);

        return $reservation->fresh([
            'user',
            'departure.package',
        ]);
    }
}
