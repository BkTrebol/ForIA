<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class AuthController extends Controller
{
    function login(Request $request){

        if(!Auth::attempt($request->only(['email', 'password']),$request->remember)){
            return response()->json([
                'message' => 'Email & Password does not match with our record.',
            ], 401);
        }

        $user = Auth::user();
        
        return response()->json([
            "message" => "Logged in successfully.",
            'remember' => $user->remember_token,
            'token' => $user->createToken('token')->plainTextToken
        ])
            
            // ->withCookie(cookie('remember_token',$user->remember_token))
            ;

    }

    function register(Request $request){

        $request->validate([
            'nick' => ['required', 'string', 'max:100','unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    User::create([
        'nick' => $request->nick,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return response()->json(['message' => 'User created successfully'])->status(201);
    }

    function holi(){
        return Auth::viaRemember() ? "aa":"nono";
    }
}
