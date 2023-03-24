<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{   

    function getUserData(Request $request){
        return response()->json([
            'user' => $request->user()->only(['id','nick','email','location','birthday','avatar',])
        ]);
    }

    function editUserData(Request $request){

    }

    function getUserPreferences(Request $request){
        return response()->json([
            'preferences' => $request->user()->preferences
        ]);
    }

    function editUserPreference(Request $request){

    }

    function profile(User $user){
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;

        if ($isAdmin || $user->prefrences->allow_view_profile){
            return response()->json([
                'user' => $user
            ]);

        }
    }
}
