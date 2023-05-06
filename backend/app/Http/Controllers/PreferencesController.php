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
  }