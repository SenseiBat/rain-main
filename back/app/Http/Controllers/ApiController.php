<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
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
}
