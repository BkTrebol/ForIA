<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class SidebarController extends Controller
{
    function getUserSidebarStats(){
        $user = Auth::user();

        $posts = $user->posts->count();
        $topics = $user->topics->count();
        
        $pmsReceied = $user->privateMessages->count();
        $newPms = $user->privateMessages->where("viewed",false)->count();

        return response()->json([
            "messages" => $posts+$topics,
            "pms" => $pmsReceied,
            "newPms" => $newPms,
        ]);
    }
    
    function lastFive()
    {
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles()->pluck('role_id')->toArray() : [1];
        $isAdmin = $user->isAdmin();
        $posts = Post::selectRaw('posts.id as post_id,topics.id as id, posts.created_at as created_at, topics.title as title,(select count(*) from posts where topic_id = topics.id) as num_posts, (select nick from users where id = posts.user_id) as user_nick, (select id from users where id = posts.user_id) as user_id, (select avatar from users where id = posts.user_id) as user_avatar')
        ->whereHas('topic', function ($query) use ($roles) {
            $query->whereIn('can_view', $roles)
                ->whereHas('category', function ($query) use ($roles) {
                    $query->whereIn('can_view', $roles);
                });
        })
        ->leftJoin('topics', 'posts.topic_id', '=', 'topics.id');

    $topics = Topic::selectRaw('"0" as post_id,id, created_at,title, (select count(*) from posts where topic_id = topics.id) as num_posts, (select nick from users where id = topics.user_id) as user_nick, (select id from users where id = topics.user_id) as user_id, (select avatar from users where id = topics.user_id) as user_avatar')
        ->whereIn('can_view', $roles)
        ->whereHas('category', function ($query) use ($roles) {
            $query->whereIn('can_view', $roles);
        });

    $latest = $topics->union($posts)->orderBy('created_at', 'desc')->take(5)->get()
        ->map(function ($item){

            $item->last_page = ceil(($item->num_posts+1) / config('app.pagination.topic'));
            unset($item['num_posts']);

            return $item;
        });



        return response()->json($latest, 200);
    }

    function getForumStats(){

        $topics = Topic::all()->count();
        $posts = Post::all()->count();
        $users = User::all()->count();
        $lastUser = User::orderBy('created_at','desc')->first();
        $lastPoll = Poll::where('finish_date','>',now())->orWhere('finish_date',null)->orderBy('created_at','desc')->first();

        return response()->json([
            "topics" => $topics,
            "posts" => $posts,
            "users" => $users,
            "lastUser" => $lastUser->only('id','nick','rol'),
            "lastPoll" => $lastPoll,
        ],200);
    }
}
