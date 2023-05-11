<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublicRole;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    //
    function getList(Request $request){
        $user = Auth::user();
        $userMaxrol = $user->roles()->orderBy('order','desc')->first()->order;
        $roles = Role::where('order','<=',$userMaxrol)->where('id','>',2)->get();
        return response()->json($roles,200);
    }

    function getAll(Request $request){
        $roles = Role::orderBy('order','desc')->get();
        return response()->json($roles,200);
    }

    function getPublic(Request $request){
        $roles = PublicRole::all();
        $roles->makeVisible('posts');
        return response()->json($roles,200);
    }
}
