<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    /**
     * URL de base de l'API VTOM
     */
    private const VTOM_API_URL = 'https://10.37.44.206:40010/vtom/public/domain/5.0';

    /**
     * Clé d'authentification pour l'API VTOM
     */
    private const VTOM_API_KEY = 'Esp4Qo4tMy8rVe3q';

    /**
     * Endpoint de test pour vérifier la communication avec le front.
     *
     * @return JsonResponse
     */
    public function message(): JsonResponse
    {
        return response()->json([
            'message' => 'Hello depuis Laravel !',
            'timestamp' => now()->toIso8601String(),
            'status' => 'ok',
        ]);
    }

    /**
     * Récupère la liste des environnements VTOM.
     * Proxy vers l'API VTOM pour éviter les problèmes CORS et SSL.
     *
     * @return JsonResponse
     */
    public function vtomEnvironments(): JsonResponse
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-API-KEY' => self::VTOM_API_KEY,
            ])
            ->withoutVerifying() // Désactive la vérification SSL pour les certificats auto-signés
            ->timeout(30)
            ->get(self::VTOM_API_URL . '/environments');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            Log::error('VTOM API Error (environments)', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return response()->json([
                'error' => 'Failed to fetch environments from VTOM',
                'status' => $response->status(),
                'details' => $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error('VTOM API Exception (environments)', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to connect to VTOM API',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère la liste des applications d'un environnement VTOM.
     * Proxy vers l'API VTOM pour éviter les problèmes CORS et SSL.
     *
     * @param string $environment Nom de l'environnement
     * @return JsonResponse
     */
    public function vtomApplications(string $environment): JsonResponse
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-API-KEY' => self::VTOM_API_KEY,
            ])
            ->withoutVerifying()
            ->timeout(30)
            ->get(self::VTOM_API_URL . '/environments/' . urlencode($environment) . '/applications');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            Log::error('VTOM API Error (applications)', [
                'environment' => $environment,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return response()->json([
                'error' => 'Failed to fetch applications from VTOM',
                'status' => $response->status(),
                'details' => $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error('VTOM API Exception (applications)', [
                'environment' => $environment,
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to connect to VTOM API',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère la liste des utilisateurs VTOM.
     * Proxy vers l'API VTOM pour éviter les problèmes CORS et SSL.
     *
     * @return JsonResponse
     */
    public function vtomUsers(): JsonResponse
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-API-KEY' => self::VTOM_API_KEY,
            ])
            ->withoutVerifying()
            ->timeout(30)
            ->get(self::VTOM_API_URL . '/users');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            Log::error('VTOM API Error (users)', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return response()->json([
                'error' => 'Failed to fetch users from VTOM',
                'status' => $response->status(),
                'details' => $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error('VTOM API Exception (users)', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to connect to VTOM API',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
