<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Google_Client;
use Carbon\Carbon;
use Illuminate\Auth\Notifications\VerifyEmail;
use Firebase;
use Illuminate\Support\Facades\Notification;

use App\Models\User;

class AuthController extends Controller
{
    function login(Request $request){
        if (Auth::user()) return response()->json(['message' => 'Unauthorized'],403);
        if(!Auth::attempt($request->only(['email', 'password']),$request->remember_me)){
            return response()->json([
                'message' => 'Email or Password does not match with our record.',
            ], 401);
        }

        $user = Auth::user();
        if (Carbon::parse($user->suspension)->isFuture()){
            return response()->json([
                'message' => 'User suspended.'
            ],403);
        }
        return response()->json([
            "message" => "Logged in successfully.",
        ],200)
        ;
    }

    function register(Request $request){
        if (Auth::user()) return response()->json(['message' => 'Unauthorized'],403);
        $request->validate([
            'nick' => ['required', 'string', 'max:100','unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
         ]);

        $user = User::create([
            'nick' => $request->nick,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if (env('APP_DEBUG')==false && !$user->hasVerifiedEmail()) {
            $user->notify(new VerifyEmail());
        }

        Auth::login($user);

        return response()->json(['message' => 'User created successfully'],201);
    }

    function checkLogin(){
        $user = Auth::user();
        return response()->json(
            $user ? true : false
            ,200);
    }

    function userData(Request $request){
        $user = Auth::user();
        $preferences = Auth::user()->preferences->only('sidebar','allow_music');
        $user['isAdmin'] = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $user['isVerified'] = $user->hasVerifiedEmail();

        return response()->json([
            'userData'=> $user,
            'userPreferences' => $preferences,
        ],200);
    }

    function resendVerification(Request $request){
        $user = Auth::user();
        if (!$user->hasVerifiedEmail()) {
            $user->notify(new VerifyEmail());
        }
    }

    function googleAuth(Request $request){

        $csrf_token_cookie = $_COOKIE['g_csrf_token'];
        if (! $csrf_token_cookie){
            return redirect()->away('http://localhost:4200/auth/login');
        }
        $csrf_token_body = $request->get('g_csrf_token');
        if (!$csrf_token_body){
            return redirect()->away('http://localhost:4200/auth/login');
        }
        if ($csrf_token_cookie != $csrf_token_body){
            return redirect()->away('http://localhost:4200/auth/login');
        }

        $id_token = $request->credential;
        $client = new Google_Client(['client_id' => config('app.GOOGLE_CLIENT_ID')]);  // Specify the CLIENT_ID of the app that accesses the backend
        
        // Fix clock sync error.
        Firebase\JWT\JWT::$leeway = 5;
        do {
            $attempt = 0;
            try {
                $payload = $client->verifyIdToken($id_token);
                $retry = false;
            } catch (Firebase\JWT\BeforeValidException $e) {
                $attempt++;
                $retry = $attempt < 2;
            }
        } while ($retry);

        // $payload = $client->verifyIdToken($id_token);

        if (!$payload) {
            return redirect()->away('http://localhost:4200/auth/login');
        } else{
            $userid = $payload['sub'];
            $user = User::where('email', $payload['email'])->first();
            if (!$user){
                $nick = explode(' ',$payload['given_name'])[0];
                $tempNick = $nick;
                $validNick = false;
                while (!$validNick){
                if(User::where('nick',$tempNick)->first()){
                    $tempNick .= fake()->numberBetween(1000,9999);
                } else{
                    $nick = $tempNick;
                    $validNick = true;
                }}

                $user = User::create([
                    'nick' => $nick,
                    'email' => $payload['email'],
                    'google_auth'=> true,
                    'avatar' => $payload['picture'],
                    'email_verified_at' => now(),
                ]);
                // Auth::login($user);
            }
            if(Carbon::parse($user->suspension)->isFuture()){
                return redirect()->away('http://bing.com/');
            }
            if($user->google_auth ){
                Auth::login($user);
                return redirect()->away('http://localhost:4200/#googleauth');
            } else{
                return redirect()->away('http://localhost:4200/auth/login?email='.$user->email);
            }

        }
    }

    function confirmGoogle(Request $request){
        if (Auth::attempt($request->only(['email', 'password']),$request->remember)){
            $user = Auth::user();
            $user->google_auth = true;
            // Checks if user had verified its email and valiates it.
            if($user->email_verified_at == null){
                $user->email_verified_at = now();
            }
            $user->update();
            Auth::login($user);
            return response()->json([
                'message' => 'Account linked to Google account successfully',
            ],200);
        }
        else{
            return response()->json([
                'message' => 'Email or Password does not match with our record.'
            ],401);
        }

    }

    function adminAuth(User $user, Request $request){
        Auth::logout();
        Auth::login($user);
        $request->session()->regenerateToken();
        return response()->json([
            'message' => "Login \"as\" {$user->nick} successfully",
        ],200);
    }

    function logout(Request $request){

        $request->user()->tokens()->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Auth::guard('web')->logout();

        return response()->json([
            'message' => 'Logout successfully',
        ],200);
    }
}
