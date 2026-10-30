<?php

namespace App\Http\Controllers\Api;




use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService
    ) {}

    // Réservations du client connecté
    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::with('departure.package')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    // Créer une réservation
    public function store(
        StoreReservationRequest $request
    ): JsonResponse {
        $reservation = $this->reservationService->create(
            $request->user(),
            (int) $request->validated('departure_id')
        );

        return response()->json([
            'message' => 'Réservation créée avec succès.',
            'reservation' => $reservation->load('departure.package'),
        ], 201);
    }

    // Réservations pour l'administrateur
    public function adminIndex(): JsonResponse
    {
        $reservations = Reservation::with([
            'user',
            'departure.package',
        ])->latest()->get();

        return response()->json($reservations);
    }

    // Modifier le statut
    public function updateStatus(
        UpdateReservationStatusRequest $request,
        Reservation $reservation
    ): JsonResponse {
        $updatedReservation = $this->reservationService->updateStatus(
            $reservation,
            $request->validated('statut')
        );

        return response()->json([
            'message' => 'Statut modifié avec succès.',
            'reservation' => $updatedReservation,
        ]);
    }
}
