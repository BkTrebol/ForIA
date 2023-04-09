<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Post;
use App\Models\Topic;
use App\Rules\CanPostInTopic;

class PostController extends Controller
{
    function createPost(Request $request){
        $request->validate([
            'topic_id' => ['required',new CanPostInTopic],
            'content' => ['required']
         ]);
        $topic = Topic::find($request->topic_id);
        $user = Auth::user();
        if (!in_array($topic->can_view,$user->roles) || !in_array($topic->category->can_view,$user->roles)){
            return response()->json([
                'message' => 'Unauthorized',
            ],403);
         }

         $post = Post::create([
            'topic_id' => $request->topic_id,
            'user_id' => $request->user()->id,
            'content' => $request->content,
         ]);
    }

    function getPostData(Post $post){
        return response()->json([
            "post" => $post
        ]);
    }
    
    function editPost(Post $post, Request $request){
        if (!checkPermission($post)){
            return response()->json([
                'message' => 'Unauthorized'
            ],403);
        } else {
            $request->validate([
                'content' => ['required']
            ]);

            $post->content = $request->content;
            $post->update();
            return response()->json([
                'message' => 'Post edited successfully',
                'post' => $post
            ],200);
        }
    }

    function deletePost(Post $post,Request $request){ 
       
        if (!checkPermission($post)){
            return response()->json([
                'message' => 'Unauthorized'
            ],403);
        } else {
            $post->delete();
            if ($post->topic->posts->count() == 0){
                $post->topic->delete();
            }
            return response()->json([
                'message' => 'Post deleted successfully'
            ],200);
        }
     }
    }

    function checkPermission(Post $post){
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($post->topic->category->can_mod, $user->roles);
        if (!$isAdmin && !$isMod) {
            // IF the used isn't either an admin or a mod, chekcs if is the owner of the post and the post is the last one of the topic.
            if($post->user_id != $user->id || 
            Post::where('topic_id', $post->topic_id)->orderBy('created_at','desc')->first()->id != $post->id){
                return false;
            }
        }
        return true;
    }