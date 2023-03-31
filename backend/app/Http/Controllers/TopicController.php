<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Rules\CanPostInCategory;
use Illuminate\Support\Facades\Validator;

use App\Models\Topic;
use App\Models\Post;

class TopicController extends Controller
{
    function viewTopic(Topic $topic){
        // Returns the posts in a topic if the user can view the topic and its category.
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        if(!in_array($topic->category->can_view,$roles) || !in_array($topic->can_view,$roles) )
        return response()->json(['message' => "Unauthorized"],403);
        else
        return response()->json([
            'can_edit' => in_array($topic->category->can_mod,$roles) || $topic->user_id == $user->id,
            'can_post' => in_array($topic->can_post,$roles),
            'category' => $topic->category->only('id','title'),
            'topic' => $topic->only('id','user_id','title','created_at','updated_at'),
            'posts' => $topic->posts,
        ],200);

    }

    function createTopic(Request $request){
        // Creates a new topic if the user can view the containing category.
        $request->validate([
           'title' => ['required','min:3','max:255'],
           'category_id' => ['required',new CanPostInCategory],
           'description' => ['max:255'],
           'content' => ['required']
        ]);

        $topic = Topic::create([
            'category_id' => $request->category_id,
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        $post = Post::create([
            'topic_id' => $topic->id,
            'user_id' => $request->user()->id,
            'content' => $request->content
        ]);

        return response()->json([
            'message' => 'Topic created successfully',
            'topic' => $topic,
        ],201);
    }

    function editTopic(Topic $topic,Request $request){
        $request->validate([
            'title' => ['required','min:3','max:255'],
            'category_id' => ['required',new CanPostInCategory],
            'description' => ['max:255'],
            'content' => ['required']
         ]);

         $user = Auth::user();
         // Checks if user owns the topic or can edit it.
         if (!in_array($topic->category->can_mod,$user->roles) && ($user->id != $topic->user->id || $topic->posts->count() > 1)) {
            return response()->json([
                'message' => 'Unauthorized',
            ],403);
         }
         // Checks if the user is trying to change topic category, and only allows it if it has can_mod role of the category,
         if($topic->category_id != $request->category_id){
            if (!in_array($topic->category->can_mod,$user->roles)){
                return response()->json([
                    'message'=> 'Unauthorized',
                ],403);
            }else
            $topic->category_id = $request->category_id;
         }


         $topic->title = $request->title;
         $topic->description = $request->description;
         $topic->update();
        
         return response()->json([
            'message'=> 'Topic updated succesfully',
         ],200);
    }

    function deleteTopic(Topic $topic,Request $request){
        // Checks if user is admin, else if user has right to delete the topic.
        // If user is not admin just moves the topic to the Trash Category.
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        if($isAdmin){
            $topic->delete();
            return response()->json(['message'=>'Topic deleted succesfully'],200);
        } elseif(in_array($topic->category->can_mod,$user->roles) || 
        ($topic->user->id == $user->id && $topic->posts->count() <= 1)){
            $topic->category_id = config('app.trash');
            $topic->update();
            return response()->json(['message'=>'Topic deleted succesfully'],200);
        } else {
            return response()->json([
                'message'=>'Unauthorized',
            ],403);
        }       
    }
}
