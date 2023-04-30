<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Post;
use App\Models\Topic;
use App\Rules\CanPostInTopic;

class PostController extends Controller
{
    function createPost(Request $request)
    {
        $request->validate([
            'topic_id' => ['required', new CanPostInTopic],
            'content' => ['required']
        ]);
        $topic = Topic::find($request->topic_id);
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        if (!in_array($topic->can_view, $roles) || !in_array($topic->category->can_view, $roles)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $post = Post::create([
            'topic_id' => $request->topic_id,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);
    }

    function getPostData(Post $post)
    {
        return response()->json([
            "post" => $post
        ]);
    }

    function editPost(Post $post, Request $request)
    {
        if (!checkPermission($post)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        } else {
            $request->validate([
                'content' => ['required']
            ]);

            $post->content = $request->content;
            $post->update();
            return response()->json([
                'message' => 'Post edited successfully',
                'post' => $post
            ], 200);
        }
    }

    function deletePost(Post $post, Request $request)
    {

        if (!checkPermission($post)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        } else {
            $post->delete();
            if ($post->topic->posts->count() == 0) {
                $post->topic->delete();
            }
            return response()->json([
                'message' => 'Post deleted successfully'
            ], 200);
        }
    }
    function lastFive()
    {
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($roles)->intersect(config('app.adminRoles'))) > 0;
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
}


function checkPermission(Post $post)
{
    $user = Auth::user();
    $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
    $isMod = in_array($post->topic->category->can_mod, $user->roles);
    if (!$isAdmin && !$isMod) {
        // IF the used isn't either an admin or a mod, chekcs if is the owner of the post and the post is the last one of the topic.
        if (
            $post->user_id != $user->id ||
            Post::where('topic_id', $post->topic_id)->orderBy(
                'created_at',
                'desc'
            )->first()->id != $post->id
        ) {
            return false;
        }
    }
    return true;
}