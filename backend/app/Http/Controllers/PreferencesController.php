<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class PreferencesController extends Controller
{

  function editSidebar(Request $request){
        $preferences = Auth::user()->preferences;

        $request->validate([
            "sidebar" => ['required', 'boolean'],
        ]);

        $preferences->sidebar = $request->sidebar;
        $preferences->update();

        return response()->json([
            'message' => 'Sidebar edited successfully'
        ],200);
    }
    
       function getUserPreferences(Request $request){
        return response()->json($request->user()->preferences
        ,200);
    }

    function editUserPreference(Request $request){
        $preferences = Auth::user()->preferences;

        $request->validate([
            "sidebar" => ['boolean'],
            "filter_bad_words" => ['boolean'],
            "allow_view_profile" => ['boolean'],
            "allow_user_to_mp" => ['boolean'],
            "hide_email" => ['boolean'],
            "language" => ['string'],
            "allow_music"=> ['boolean'],
        ]);

        $preferences->sidebar = $request->sidebar;
        $preferences->filter_bad_words = $request->filter_bad_words;
        $preferences->allow_view_profile = $request->allow_view_profile;
        $preferences->allow_user_to_mp = $request->allow_user_to_mp;
        $preferences->hide_email = $request->hide_email;
        $preferences->allow_music = $request->allow_music;
        $preferences->language = $request->language;
        $preferences->update();

        return response()->json([
            'message' => 'Preferences edited successfully'
        ],200);
    }

}