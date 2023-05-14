<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminLoginController extends Controller
{
    function login(Request $request){
        
        if(!Auth::attempt($request->only(['email', 'password']),$request->remember_me)){
            return response()->json([
                'message' => 'Email or Password does not match with our record.',
            ], 401);
        }

        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        if(!$isAdmin){
            return response()->json("Unauthorized",403);
        }

        $request->session()->put('admin', true);
        return response()->json("Logged in successfully."
        ,200)
        ;
    }

    function checkAdmin(Request $request){
        $isAdmin = $request->session()->pull('admin',false);
        if($isAdmin){
            $request->session()->put('admin', true);
            return response()->json(true,200);
        }
        return response()->json(false,200);
    }
    function getUserListAdmin(){
        if(config('env') === 'production'){
            return response()->json('Unauthorized',403);
        }

        return response()->json(
           User::all() , 200
        );
    }

    function adminAuth(User $user, Request $request){
        if(config('env') === 'production'){
            return response()->json('Unauthorized',403);
        }
        
        Auth::guard('web')->logout();
        Auth::login($user);
        $request->session()->regenerateToken();
        return response()->json([
            'message' => "Login \"as\" {$user->nick} successfully",
        ],200);
    }
}
