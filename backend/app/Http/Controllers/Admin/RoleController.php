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
        $userMaxrol = $user->roles()->orderBy('id','desc')->first()->id;
        $roles = Role::where('id','<=',$userMaxrol)->get();
        return response()->json($roles);
    }
}
