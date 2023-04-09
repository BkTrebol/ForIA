<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class UserController extends Controller
{   

    function getUserData(Request $request){
        return response()->json([
            'user' => $request->user()->only(['id','nick','email','location','birthday','avatar',])
        ],200);
    }

    function editUserData(Request $request){
        $user = Auth::user();
        $request->validate([
                'nick' => ['required', 'string', 'max:100','unique:users,nick,'.$user->id],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
                'location'=> ['string'],
                'birthday' => ['date'],
                'avatar' => ['image','mimes:jpg,png,jpeg,gif,svg'],
        ]);

        $user->nick = $request->nick;
        $user->email = $request->email;
        $user->location = $request->location;
        $user->birthday = $request->birthday;

        $avatar = $request->file('avatar');
        if ($avatar){
            $avatar_path = $avatar->store('avatars');
            preg_match('/.*\/(.*(?:.png|.jpg|.jpeg|.gif|.svg))/',$avatar_path,$match);
            $user->avatar = $match[1];
        }

        $user->update();

        return response()->json([
            'message' => 'User data updated successfully',
            'user' => $user
        ],200);
    }

    function changePassword(Request $request){
        $user = Auth::user();
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'old_password' => ['required',function($attribute,$old_password,$error)use ($user){
                if (!Hash::check($old_password,$user->password)){
                    $error('Wrong password');
                };}]
        ]);

        $user->password = Hash::make($request->password);
        $user->update();
    }

    function getUserPreferences(Request $request){
        return response()->json([
            'preferences' => $request->user()->preferences
        ],200);
    }

    function editUserPreference(Request $request){
        $preferences = Auth::user()->preferences;
            $request->validate([
                "sidebar" => ['boolean'],
                "filter_bad_words" => ['boolean'],
                "allow_view_profile" => ['boolean'],
                "allow_user_to_mp" => ['boolean'],
                "hide_online_presence" => ['boolean'],
                "two_fa" => ['boolean'],
                "allow_music"=> ['boolean'],
            ]);
            $preferences->sidebar = $request->sidebar;
            $preferences->filter_bad_words = $request->filter_bad_words;
            $preferences->allow_view_profile = $request->allow_view_profile;
            $preferences->allow_user_to_mp = $request->allow_user_to_mp;
            $preferences->hide_online_presence = $request->hide_online_presence;
            $prefereces->allow_music = $request->allow_music;
            $prefereces->two_fa = $request->two_fa;
            $prefereces->update();

            return response()->json([
                'message' => 'Preferences edited successfully'
            ],200);
    }

    function profile(User $user){
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;

        if ($isAdmin || $user->prefrences->allow_view_profile){
            return response()->json([
                'user' => $user
            ],200);

        }
    }
}
