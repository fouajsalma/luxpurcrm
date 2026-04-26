<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    // GOOGLE AUTH
    public function googleAuth(Request $request)
    {
        $googleToken = $request->credential;

        // Vérifier le token Google
        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $googleToken
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $googleUser = $response->json();

        // Chercher ou créer l'utilisateur
        $user = User::where('email', $googleUser['email'])->first();

        if (!$user) {
            $user = User::create([
                'nom' => $googleUser['family_name'] ?? 'User',
                'prenom' => $googleUser['given_name'] ?? 'Google',
                'email' => $googleUser['email'],
                'password' => 'google_' . uniqid(), // Mot de passe factice auto-haché par le cast
                'avatar' => $googleUser['picture'] ?? null,
            ]);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
        'nom' => 'required|string|max:100',
        'prenom' => 'required|string|max:100',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
        'nom' => $request->nom,
        'prenom' => $request->prenom,
        'email' => $request->email,
        'password' => $request->password,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        return response()->json([
            'user' => JWTAuth::user(),
            'token' => $token
        ]);
    }

    // GET USER
    public function me()
    {
        return response()->json(auth()->user());
    }

    // LOGOUT
   public function logout()
{
    try {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to logout'
        ], 500);
    }
}

    // REFRESH TOKEN
    public function refresh()
    {
        return response()->json([
            'token' => JWTAuth::refresh()
        ]);
    }
}
