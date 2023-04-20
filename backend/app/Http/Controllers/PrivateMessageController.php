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
    
    function getMessagesReceived(){
        $user = Auth::user();
        $received = PrivateMessage::where('receiver_id',$user->id)->where(function($query) use ($user) {
            $query->where('deleted_by', '<>', $user->id)
                  ->orWhereNull('deleted_by');
        })->with('sender:id,nick')
        ->orderBy('created_at','desc')->select('id','sender_id','title','created_at')->paginate(10);

        return response()->json([
                "messages" => $received->items(),
                "current_page" => $received->currentPage(),
                "last_page" => $received->lastPage(),
                "total" => $received->total(),
        ]);
    }
    function getMessagesSent(){
        $user = Auth::user();

        $sent = PrivateMessage::where('sender_id',$user->id)->where(function($query) use ($user) {
            $query->where('deleted_by', '<>', $user->id)
                  ->orWhereNull('deleted_by');
        })->with('receiver:id,nick')
        ->orderBy('created_at','desc')->select(['id','receiver_id','title','created_at'])->paginate(10);

        return response()->json([
                "messages" => $sent->items(),
                "current_page" => $sent->currentPage(),
                "last_page" => $sent->lastPage(),
                "total" => $sent->total(),
        ]);
    }


    function getPrivateMessage(PrivateMessage $pm){
        $user = Auth::user();
        // $valid = PrivateMessage::where('receiver_id',$user->id)->orWhere('sender_id',$user->id);
        $valid = $pm->receiver_id == $user->id || $pm->sender_id == $user->id;
        if (!$valid){
            return response()->json([
                "message" => "Unauthorized"
            ],403);
        }

        if($user->id == $pm->receiver_id){
            $pm->viewed = true;
            $pm->save();
        }

        $thread = PrivateMessage::where('thread_id',$pm->thread_id)->with('sender:id,nick,avatar')
        ->orderBy('created_at','desc')->paginate(10);
        $pm->load('sender:nick,id,avatar,rol');
        $recipient = $user->id == $pm->receiver_id ? $pm->sender_id : $pm->receiver_id;
        if($thread->currentPage() != 1){
            $pm = $pm->only('id','receiver_id','sender_id','thread_id','sender','title');
        };
        $response = [
            "message" => $pm,
            "thread" => $thread->items(),
            "recipient" => $recipient,
            "current_page" => $thread->currentPage(),
            "last_page" => $thread->lastPage(),
            "total" => $thread->total()
        ];

        return response()->json($response,200);
    }

    function newPrivateMessage(Request $request){
        $user = Auth::user();

        $request->validate([
            "title" => ['required'],
            "content" => ['required'],
            "recipient" => ["required","exists:users,id","not_in:$user->id"],
        ]);

        $newMessage =
        [
            'sender_id' => $user->id,
            'receiver_id' => $request->recipient,
            'title' => $request->title,
            'content' => $request->content,
        ];

        if($request->thread_id){
            $newMessage['thread_id'] = $request->thread_id;
            if(!PrivateMessage::where('thread_id', $request->thread_id)
            ->where(function ($query) use ($user) {
                $query->where('receiver_id', $user->id)
                      ->orWhere('sender_id', $user->id);
          })->where(function ($query) use ($request) {
            $query->where('receiver_id', $request->recipient)
                  ->orWhere('sender_id',  $request->recipient);
      })
            ->first()){
                return response()->json([
                    "message" => "Unauthorized"
                ],403);
            };
        };

        $pm = PrivateMessage::create($newMessage);

        return response()->json([
            'message' => "Private message created successfully",
            'id' => $pm->id,
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
