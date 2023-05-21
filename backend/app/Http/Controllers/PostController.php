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
        $roles = self::roles($request);
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

        $response = [
            'id' => $post->id,
            'lastPage' => $topic->posts()->paginate(config('app.pagination.topic'))->lastPage(),
        ];
        if($user->public_role_id !== $post->user->public_role_id){
            $response['newRole'] = $post->user->publicRole;
        }

        return response()->json($response,201);
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
                'content' => ['required'],
                'topic_id' => ['required', 'exists:topics,id']
            ]);

            $post->content = $request->content;
            $user = Auth::user();
            $roles = self::roles($request);
            if($user->isAdmin()){
                $post->topic_id = $request->topic_id;
            }

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
            return response()->json([
                'message' => 'Post deleted successfully'
            ], 200);
        }
    }

    function getOnePost(Post $post)
    {
        if (!checkPermission($post)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }else{
            return response()->json(
                ['post' => $post->only('topic_id', 'content'),
                'topic' => Topic::where('id', $post->topic_id)->first()->only('title')]
            );
        }
    }

    // Topics
    function getOneTopic(Topic $topic)
    {
        return response()->json(
            $topic->only('title')
        );
    }

    function getAllTopic(Request $request)
    {
        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $topics = Topic::select('id', 'title')
            ->orderBy('title', 'asc')
            ->get()
            ->filter(function ($topic) use ($roles, $isAdmin) {
                return (
                    (in_array($topic->can_post, $roles) && in_array($topic->category->can_post, $roles)) &&
                    (in_array($topic->can_view, $roles) && in_array($topic->category->can_view, $roles))
                ) || $isAdmin;
            });
        return response()->json(
            $topics
        );
    }

}


function checkPermission(Post $post)
{
    $user = Auth::user();
    $roles = $user && $user->hasVerifiedEmail() ? $user->roles()->pluck('role_id')->toArray() : [1];
    $isAdmin = $user->isAdmin();
    $isMod = in_array($post->topic->category->can_mod, $roles);
    if (!$isAdmin && !$isMod) {
        // IF the user isn't either an admin or a mod, checks if is the owner of the post and the post is the last one of the topic.
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