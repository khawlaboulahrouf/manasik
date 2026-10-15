<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $result = $this->authService->register($data);

        return response()->json([
            'message' => 'Inscription réussie',
            ...$result,
        ], 201);
    }

    // public function login(Request $request)
    // {
    //     $data = $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required',
    //     ]);

    //     $result = $this->authService->login($data);

    //     if (!$result) {
    //         return response()->json([
    //             'message' => 'Email ou mot de passe incorrect',
    //         ], 401);
    //     }

    //     return response()->json([
    //         'message' => 'Connexion réussie',
    //         ...$result,
    //     ]);
    // }

    // public function me(Request $request)
    // {
    //     return response()->json($request->user());
    // }

    // public function logout(Request $request)
    // {
    //     $this->authService->logout($request->user());

    //     return response()->json([
    //         'message' => 'Déconnexion réussie',
    //     ]);
    // }
}