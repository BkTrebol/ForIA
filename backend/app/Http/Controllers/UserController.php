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
            $request->user()->only(['nick','email','location','birthday','avatar'])
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
            "hide_online_presence" => ['boolean'],
            "two_fa" => ['boolean'],
            "allow_music"=> ['boolean'],
        ]);

        $preferences->sidebar = $request->sidebar;
        $preferences->filter_bad_words = $request->filter_bad_words;
        $preferences->allow_view_profile = $request->allow_view_profile;
        $preferences->allow_user_to_mp = $request->allow_user_to_mp;
        $preferences->hide_online_presence = $request->hide_online_presence;
        $preferences->allow_music = $request->allow_music;
        $preferences->two_fa = $request->two_fa;
        $preferences->update();

        return response()->json([
            'message' => 'Preferences edited successfully'
        ],200);
    }

    function profile(User $user){
        $viewer = Auth::user();
        $roles = $viewer ? $viewer->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($roles)->intersect(config('app.adminRoles'))) > 0;
        if ($isAdmin || $user->preferences->allow_view_profile){
            $user['can_pm'] = $user->preferences->allow_user_to_mp ? true : false;
            if($user->last_post()->count() > 0){
                $user['last_post'] = $user->last_post()->with('topic:id,title')->first()->only('topic','created_at');
            }
            $user['is_verified'] = $user->hasVerifiedEmail();
            return response()->json(
                $user
            ,200);
        }else {
            return response()->json([
                "message" => "Can't view user profile."
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
        $roles = $viewer ? $viewer->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($roles)->intersect(config('app.adminRoles'))) > 0;

        if ($isAdmin || $user->preferences->allow_view_profile){
            $res = ['user' => $user->only('id', 'nick', 'avatar', 'rol'),
                    'posts' => $user->posts()->get()->map->only(['id', 'topic_id', 'created_at']),
                    'topics' => $user->topics()->get()->map->only(['id', 'category_id', 'created_at']),
                    'private_message_sender' => $user->private_message_sender()->get()
                    ->map->only(['id', 'reciever_id', 'created_at']),
                    'private_message_reciever' => $user->private_message_reciever()->get()
                    ->map->only(['id', 'sender_id', 'created_at'])
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
        $roles = $viewer ? $viewer->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($roles)->intersect(config('app.adminRoles'))) > 0;

        if ($isAdmin || $user->preferences->allow_view_profile){
            $res = ['topics' => Topic::where('user_id', $user->id)
                    ->withCount('posts')
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
}
