<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    //

    function getList(Request $request){
        // Consulta base
        $query = User::where('nick','<>','Guest')->withCount('posts');
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

    function getUser(User $user){
        $user->makeVisible(['suspension','roles']);
        $user['roles'] = $user->roles()->where('role_id','>',2)->get();
        $user['verified'] = $user->hasVerifiedEmail();
        return response()->json($user,200);
    }

    function checkNick(Request $request){
        $newNick = $request->input('nick');
        $oldNick = $request->input('oldNick');
        if($newNick != $oldNick){
            $user = User::select('id')->where('nick',$newNick)->first();
            if($user !== null){
                return response()->json($user->id,200);
            } else{
                return response()->json(false,200);
            }
        }
    }

    function checkEmail(Request $request){
        $newEmail = $request->input('email');
        $oldEmail = $request->input('newEmail');
        if($newEmail != $oldEmail){
            $user = User::select('id')->where('email',$newEmail)->first();
            if($user !== null){
                return response()->json($user->id,200);
            } else{
                return response()->json(false,200);
            }
        }
    }
    function updateUser(Request $request){
        $user = User::find($request->id);
        $request->validate([
            'nick' => ['required', 'string', 'max:100','unique:users,nick,'.$user->id],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'location'=> ['string','nullable'],
            'public_role_id' => ['required', 'exists:public_roles,id'],
            'birthday' => ['date','nullable'],
            'suspension' => ['date','nullable'],
            'avatar' => ['image','mimes:jpg,png,jpeg,gif,svg', 'max:200'],
        ]);


        if($request->roles){
            $user->roles()->sync($request->roles);
        }

        $user->update([
            'nick' => $request->nick,
            'email' => $request->email,
            'location' => $request->location,
            'public_role_id' => $request->public_role_id,
            'birthday' => $request->birthday,
        ]);

        if($request->has('verified')){
            if($request->email_verified_at == true){
                $user->email_verified_at = now();
            } else{
                $user->email_verified_at = null;
            }
        }
        if($request->has('password')){
            $user->password = Hash::make($request->password);
        }

        $user->suspension = $request->suspension;
        $user->public_role_id = $request->public_role_id;
        $user->save();
        $user->makeVisible(['suspension','roles']);
        $user['roles'] = $user->roles()->where('role_id','>',2)->get();
        $user['verified'] = $user->hasVerifiedEmail();

        return response()->json([
            "message" => "User updated succesfully",
            "user" => $user],200);

    }

    function deleteUser(User $user,Request $request){
        $actualUser = Auth::user();
        if($user->id === $actualUser->id){
            $request->user()->tokens()->delete();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
    
            Auth::guard('web')->logout();
        }   
        Post::where('user_id', $user->id)->update(['user_id' => 1]);
            $user->delete();
    
        
        return response()->json([
            "message" => "User deleted succesfully",
        ],200);
    }
}
