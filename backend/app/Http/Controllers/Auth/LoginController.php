<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Google_Client;
use Carbon\Carbon;
use Firebase;


use App\Models\User;
use Illuminate\Support\Facades\Session;
class LoginController extends Controller
{

    function adminAuth(User $user, Request $request){
        Auth::logout();
        Auth::login($user);
        $request->session()->regenerateToken();
        return response()->json([
            'message' => "Login \"as\" {$user->nick} successfully",
        ],200);
    }
    
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

    function checkLogin(){
        $user = Auth::user();
        return response()->json(
            $user ? true : false
            ,200);
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
                $defaultRole = Role::find(2)->first();
                $user->roles()->attach($defaultRole);
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
    function userData(Request $request){
        $user = Auth::user();
        $user->last_seen = now();
        $user->save();
        $preferences = Auth::user()->preferences->only('sidebar','allow_music');
        $user['isAdmin'] = $user->isAdmin();
        $user['isVerified'] = $user->hasVerifiedEmail();
        $user->load('publicRole');
        

        return response()->json([
            'userData'=> $user,
            'userPreferences' => $preferences,
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
