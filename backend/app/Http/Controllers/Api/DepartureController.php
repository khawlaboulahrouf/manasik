<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartureRequest;
use App\Http\Requests\UpdateDepartureRequest;
use App\Models\Departure;
use Illuminate\Http\Request;

class DepartureController extends Controller
{
    public function index()
    {
        $departures = Departure::with('package')->latest()->get();

        return response()->json($departures);
    }

    public function show(Departure $departure)
    {
        return response()->json(
            $departure->load('package')
        );
    }

    public function store(StoreDepartureRequest $request)
    {
        $departure = Departure::create($request->validated());

        return response()->json([
            'message' => 'Départ ajouté avec succès.',
            'departure' => $departure->load('package'),
        ], 201);
    }

    public function update(
        UpdateDepartureRequest $request,
        Departure $departure
    ) {
        $departure->update($request->validated());

        return response()->json([
            'message' => 'Départ modifié avec succès.',
            'departure' => $departure->fresh()->load('package'),
        ]);
    }

    public function destroy(Departure $departure)
    {
        $departure->delete();

        return response()->json([
            'message' => 'Départ supprimé avec succès.',
        ]);
    }
}
