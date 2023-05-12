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
        $roles = Role::where('order','<=',$userMaxrol)->orderBy('order')->where('id','>',2)->get();
        return response()->json($roles,200);
    }

    function getAll(Request $request,$filter = null){
        if(!$filter){
            $roles = Role::orderBy('order','desc')->get();
            return response()->json($roles,200);
        }
        else{
        $user = Auth::user();
        $userMaxrol = $user->roles()->orderBy('order','desc')->first()->order;
        $roles = Role::where('order','<',$userMaxrol)->orderBy('order')->where('id','>',2)->get();
        $nonEditable =Role::where('order','>=',$userMaxrol)->orderBy('order')->where('id','>',2)->get();
        return response()->json([
            "editable" => $roles,
            "nonEditable" => $nonEditable
        ],200);
        }
    }

    function getPublic(Request $request){
        $roles = PublicRole::orderBy('posts')->get();
        $roles->makeVisible('posts');
        return response()->json($roles,200);
    }

    function deleteRole(Role $role){
        $sameOrder = Role::where('order',$role->order);
        if($sameOrder->count() == 1){
            $higherRoles = Role::where('order','>',$role->order)->get();
            foreach($higherRoles as $r){
                $r->update([
                    'order' => $r->order-1,
                ]);
            }
        }
        $role->delete();
        return response()->json([
            "message" => "Role deleted successfully",
        ],200);
    }

    function deletePublic(PublicRole $role){
        if($role->posts === 0)
            return response()->json(["message" => "Unauthorized"],403);
        $role->delete();
        return response()->json([
            "message" => "Role deleted successfully",
        ],200);
    }

    function editRole(Request $request){
        $id = $request->id??0;
        $request->validate([
            "id" => ["required"],
            'name' => 'required|unique:roles,name,' . $id,
            'admin' => 'boolean',
        ]);

        Role::find($id)->update([
            "name" => $request->name,
            "admin" => $request->admin
        ]);
        return response()->json([
            "message" => "Role updated successfully",
        ],200);
    }

    function editPublic(Request $request){
        $id = $request->id??0;
        $request->validate([
            "id" => ["required"],
            'name' => 'required|unique:public_roles,name,' . $id,
        ]);

        PublicRole::find($id)->update([
            "name" => $request->name,
            "description" => $request->description,
            "posts" => $request->posts,
        ]);
        return response()->json([
            "message" => "Role updated successfully",
        ],200);
    }

    function createPublic(Request $request){
        $request->validate([
            'name' => 'required|unique:public_roles,name',
            'posts' => 'required|unique:public_roles,posts'
        ]);

        PublicRole::create([
            'name' => $request->name,
            'posts' => $request->posts,
            'description' => $request->description,
        ]);

        return response()->json([
            "message" => "Role created successfully",
        ],200);
    }

    function createRole(Request $request){
        $request->validate([
            'name' => 'required|unique:roles,name',
            'admin' => 'boolean',
        ]);
        $user = Auth::user();
        $userMaxrol = $user->roles()->orderBy('order','desc')->first()->order;
        $unauthorizedRole = Role::where('order','>=',$userMaxrol)->get();
        foreach ($unauthorizedRole as $role){
            $role->update(
                ['order' => $role->order+1]
            );
        }
        $order = $userMaxrol;
        Role::create([
            'name' => $request->name,
            'admin' => $request->admin,
            'order' => $order >= 3 ? $order : 3,
        ]);

        return response()->json([
            "message" => "Role created successfully"
        ],200);
    }

    function saveRoles(Request $request){

    }
}
