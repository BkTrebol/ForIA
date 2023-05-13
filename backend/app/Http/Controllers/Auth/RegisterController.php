<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Mail\ConfirmationEmail;
use App\Models\Role;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class RegisterController extends Controller
{

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
        $defaultRole = Role::find(2)->first();
        $user->roles()->attach($defaultRole);

        if (env('APP_DEBUG')==false && !$user->hasVerifiedEmail()) {
            $user->notify(new VerifyEmail());
        }
        Mail::to($user->email)->send(new ConfirmationEmail($user));
        Auth::login($user);

        return response()->json(['message' => 'User created successfully'],201);
    }
    function verifyEmail(int $id,EmailVerificationRequest $request) {
        $request->fulfill();
        return response()->json([
            "message" => "User email verified"
        ],200);
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

    function sendVerificationEmail(){
        $user = User::find(Auth::user()->id);
        Mail::to($user->email)->send(new ConfirmationEmail($user));
    }
}
