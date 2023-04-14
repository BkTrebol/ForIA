<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Models\PrivateMessage;
use App\Models\Topic;
use App\Models\Post;

class PrivateMessageController extends Controller
{
    function getMessages(){
        $user = Auth::user();

        $pms = PrivateMessage::where('user_id', $user->id)->orWhere('user2_id', $user->id)->paginate(1);
        return response()->json([
            "messages" => $pms->map(function($pm) use($user){
                $topic =  Topic::find($pm->topic_id)->load('user:id,nick')->only('id','title','description','user','created_at');
                return $topic;
            }),
            "current_page" => $pms->currentPage(),
            "last_page" => $pms->lastPage(),
            "total" => $pms->total()
        ]);

    }

    function getPrivateMessage(Topic $pm){
        $user = Auth::user();
        $isPm = PrivateMessage::where('topic_id',$pm->id)->where(function($query)use($user){
            $query->where('user_id',$user->id)->orWhere('user2_id',$user->id);
        })->exists();

        if (!$isPm){
            return response()->json([
                "message" => "Unauthorized"
            ],403);
        }

        $posts = $pm->posts()->with('user')->paginate(10);
        $response = [
            'posts' => $posts->map(function($post){
                return $post->load('user:id,nick,avatar,rol')->only('id','content','created_at','updated_at','user');
            }),
            "current_page" => $posts->currentPage(),
            "last_page" => $posts->lastPage(),
            "total" => $posts->total()
        ];
        if(!$posts->hasMorePages()){
            $response['topic'] = $pm->load('user:id,nick,avatar,rol')->only('id','title','created_at','updated_at','content','user');
        } else {
            $reseponse['topic'] = $pm->only('id','title');
        }

        return response()->json($response,200);
    }

    function newPrivateMessage(Request $request){
        $user = Auth::user();

        $request->validate([
            "title" => ['required'],
            "content" => ['required'],
            "recipient" => ["required","exists:users,id","not_in:$user->id"],
        ]);

        $topic = Topic::create([
            'category_id' => config('app.pmCategory'),
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'user_id' => $user->id,
            'can_view' => 'NONE',
            'can_post' => 'NONE',
        ]);

        $pm = PrivateMessage::create([
            'topic_id' => $topic->id,
            'user_id' => $user->id,
            'user2_id' => $request->recipient
        ]);

        return response()->json([
            'message' => "Private message created successfully",
            'pm' => $pm,
            'topic' => $topic,
        ],200);
    }

    function sendMessage(Request $request){
        $user = Auth::user();

        $request->validate([
            'topic_id' => ['required'],
            'content' => ['required']
         ]);

        $isPm = PrivateMessage::where('topic_id',$request->topic_id)->where(function($query)use($user){
            $query->where('user_id',$user->id)->orWhere('user2_id',$user->id);
        })->exists();

        if (!$isPm){
            return response()->json([
                "message" => "Unauthorized"
            ],403);
        } else{
            Post::create([
                'topic_id' => $request->topic_id,
                'user_id' => $user->id,
                'content' => $request->content
            ],200);
        }


    }
}
