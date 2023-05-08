<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    //

    function getList(Request $request){
        // Consulta base
        $query = User::withCount('posts');
        // Filtro por nick (LIKE)
        if ($request->has('nick')) {
            $query->where('nick', 'like', '%' . $request->nick . '%');
        }

        if ($request->has('verified')) {
            if($request->verified  == 'true'){
                $query->where('email_verified_at', '<=', now());
            } else{
                $query->where('email_verified_at', null);
            }
            
        }

        // Filtro por suspension (menor que)
        if ($request->has('suspension')) {
            if($request->suspension == 'true') {
                $query->where('suspension', '>', now());
            } else{
                $query->where('suspension','<',now())->orWhere('suspension',null);
            }
            
        }

        // Filtro por google_auth (booleano)
        if ($request->has('google')) {
            if($request->google == 'true'){
            $query->where('google_auth', true);
        } else{
            $query->where('google_auth', false);
        }
        }
        

        if ($request->has('roles')) {
            $roles = explode(',', $request->roles);
            if($request->has('rolesAll') && $request->rolesAll == 'true'){
                foreach ($roles as $role) {
                    $query->whereHas('roles', function ($q) use ($role) {
                        $q->where('role_id', $role);
                    });
                }
            } else{
                $query->whereHas('roles', function ($q) use ($roles) {
                    $q->whereIn('role_id', $roles);
                });
            }

        }

        if ($request->has('order') && $request->has('dir')) {
            $query->orderBy($request->order, $request->dir);
        }

        // Obtener usuarios filtrados
        $users = $query->paginate(10);
        // $users->makeVisible(['suspension','email_verified_at','google_auth','roles']);
        return response()->json([
            'users' => $users->items(),
            'page' => [
                "current" => $users->currentPage(),
                "last" => $users->lastPage(),
                "total" => $users->total(),
                "perPage" => $users->perPage()
            ],
        ]);
    }

    function getUser(){

    }

    function updateUser(){

    }

    function deleteUser(){

    }
}
