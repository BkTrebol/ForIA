<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Models\Post;
use App\Models\Topic;

class UserController extends Controller
{

    function getUserAvatar(String $avatar){
        if (Storage::disk('avatars')->exists($avatar)){
            return response(Storage::disk('avatars')->get($avatar),200);
        } else{
            return response()->json('e: '.$avatar,404);
        }
    }

    function getUserData(Request $request){
        return response()->json(
            $request->user()->load('publicRole')->only(['nick','email','location','birthday','avatar'])
        ,200);
    }

    function editUserData(Request $request){
        $user = Auth::user();

        $request->validate([
                'nick' => ['required', 'string', 'max:100','unique:users,nick,'.$user->id],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
                'location'=> ['string','nullable'],
                'birthday' => ['date','nullable'],
                'avatar' => ['image','mimes:jpg,png,jpeg,gif,svg', 'max:200'],
        ]);

        $user->nick = $request->nick;
        $user->email = $request->email;
        $user->location = $request->location;
        $user->birthday = $request->birthday;

        $avatar = $request->file('avatar');
        if ($avatar){
            if ($user->avatar){
                if (Storage::disk('avatars')->exists($user->avatar)){
                    Storage::disk('avatars')->delete($user->avatar);
                }
            }
            $avatar_path = $avatar->store('avatars');
            preg_match('/.*\/(.*(?:.png|.jpg|.jpeg|.gif|.svg))/',$avatar_path,$match);
            $user->avatar = $match[1];
        }
        if ($request->deleteAvatar == "true" && $user->avatar){
            if (Storage::disk('avatars')->exists($user->avatar)){
                Storage::disk('avatars')->delete($user->avatar);
            }
            $user->avatar = null;
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





    function profile(User $user){
        $viewer = Auth::user();
        $roles = $viewer ? $viewer->roles()->pluck('role_id')->toArray() : [1];
        $isAdmin = self::is_admin();
        if ($isAdmin || $user->preferences->allow_view_profile){
            $user['can_pm'] = $user->preferences->allow_user_to_mp ? true : false;
            if($user->last_post()->count() > 0){
                $user['last_post'] = $user->last_post()->with('topic:id,title')->first()->only('topic','created_at', 'updated_at');
            }
            $user['is_verified'] = $user->hasVerifiedEmail();
            $user->publicRole;
            if($user->preferences->hide_email){
                $user->makeHidden(['email']);
            }

            return response()->json(
                $user
            ,200);
        }else {
            return response()->json([
                "message" => "Can't view user profile"
            ],403);
        }
    }

    function getUserList(){
        $user = Auth::user();

        return response()->json(
            User::where("id",'<>',$user->id)->whereHas('preferences', function($query){
                $query->where('allow_user_to_mp',true);
            })
            ->get(['id','nick']),200
        );
    }

    function getUserListAdmin(){
        return response()->json(
           User::all() , 200
        );
    }



    function getUserStatistics(User $user){

        $viewer = Auth::user();
        $roles = $viewer ? $viewer->roles()->pluck('role_id')->toArray() : [1];
        $isAdmin = self::is_admin();

        if($isAdmin ||($viewer && $user->id === $viewer->id)){
            $res = ['user' => $user->only('id', 'nick', 'avatar', 'rol'),
                    'posts' => $user->posts()->get()->map->only(['id', 'topic_id', 'created_at']),
                    'topics' => $user->topics()->get()->map->only(['id', 'category_id', 'created_at']),
                    'private_message_sender' => $user->private_message_sender()->get()
                    ->map->only(['id', 'reciever_id', 'created_at']),
                    'private_message_reciever' => $user->private_message_reciever()->get()
                    ->map->only(['id', 'sender_id', 'created_at']),
                    'no' => false,
            ];
            return response()->json(
                $res
            ,200);
        }
        else if ($user->preferences->allow_view_profile){
            $res = ['user' => $user->only('id', 'nick', 'avatar', 'rol'),
                    'posts' => $user->posts()->get()->map->only(['id', 'topic_id', 'created_at']),
                    'topics' => $user->topics()->get()->map->only(['id', 'category_id', 'created_at']),
                    'no' => true,
            ];
            return response()->json(
                $res
            ,200);
        }else {
            return response()->json([
                "message" => "Can't view user profile statistics."
            ],403);
        }
    }

    function getUserStatistics2(User $user){

        $viewer = Auth::user();
        $roles = self::roles();
        $isAdmin = self::is_admin();

        if ($isAdmin || $user->preferences->allow_view_profile){
            $res = ['topics' => Topic::limit(5)->where('user_id', $user->id)
                    ->withCount('posts')
                    ->orderBy('updated_at','desc')
                    ->get()
                    ->pluck('posts_count', 'title'),
                ];
            return response()->json(
                $res
            ,200);
        }else {
            return response()->json([
                "message" => "Can't view user profile statistics."
            ],403);
        }
    }

    function deleteUser(Request $request){
        $user = Auth::user();
        if(!$request->has("password") || !$request->has("confirm")){
                return response()->json([
                    "meessage" => "Missing password",422]);
        }
        $password = $request->input('password');
        $confirm = $request->input('confirm');
        if($password !== $confirm){
            return response()->json([
                "meessage" => "Password mismatch",
            ],422);
        }

        if(!Hash::check($password,$user->password)){
            return response()->json([
                "message" => "Invalid password"
            ],422);
        }

        $request->user()->tokens()->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Auth::guard('web')->logout();
        Post::where('user_id', $user->id)->update(['user_id' => 1]);
        Topic::where('user_id', $user->id)->update(['user_id' => 1]);
        $user->delete();

        return response()->json([
            "message" => "User deleted successfully"
        ]);
    }
}
