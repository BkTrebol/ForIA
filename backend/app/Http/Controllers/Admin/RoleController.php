<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        return response()->json($roles);
    }

    function getAll(Request $request){
        $roles = Role::all()->orderBy('order','desc');
        return response()->json($roles);
    }
}
