<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    function login(Request $request){
        if(!Auth::attempt($request->only(['email', 'password']),$request->remember_me)){
            return response()->json([
                'message' => 'Email or Password does not match with our record.',
            ], 401);
        }

        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;

        if(!$isAdmin){
            return response()->json("Unauthorized",403);
        }

        $request->session()->put('admin', true);

        return response()->json("Logged in successfully."
        ,200)
        ;
    }

    function check(Request $request){
        $user = Auth::user();
        $value = $request->session()->pull('admin',false);
        return response()->json($value,200);
    }
}
