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
    // Bulk delete of user PMs, marks as deleted or deletes them if both users marked them.
    function deleteMessages(Request $request){
        $user = Auth::user();
        $deleteSent = $request->sentMessages;
        $deleteReceived = $request->receivedMessages;

        foreach($deleteSent as $pmId){
                $pm = PrivateMessage::find($pmId);
                if($pm->sender_id == $user->id){
                    if($pm->deleted_by == null){
                        $pm->deleted_by = $user->id;
                        $pm->save();
                    } else{
                        if($pm->deleted_by == $pm->receiver_id){
                            $pm->delete();
                        }
                    }
                }
            }

            foreach($deleteReceived as $pmId){
                $pm = PrivateMessage::find($pmId);
                if($pm->receiver_id == $user->id){
                    if($pm->deleted_by == null){
                        $pm->deleted_by = $user->id;
                        $pm->save();
                    } else{
                        if($pm->deleted_by == $pm->sender_id){
                            $pm->delete();
                        }
                    }
                }
            }

            return response()->json('Messages Deleted succesfully',200);
        }
    function getMessages()
    {
        $user = Auth::user();

        $queryReceived = PrivateMessage::where('receiver_id', $user->id)->where(function ($query) use ($user) {
            $query->where('deleted_by', '<>', $user->id)
                ->orWhereNull('deleted_by');
        })->with('sender:id,nick')
            ->orderBy('created_at', 'desc')->select(['id', 'sender_id', 'title', 'created_at', 'viewed']);
        

        $querySent = PrivateMessage::where('sender_id', $user->id)->where(function ($query) use ($user) {
            $query->where('deleted_by', '<>', $user->id)
                ->orWhereNull('deleted_by');
        })->with('receiver:id,nick')
            ->orderBy('created_at', 'desc')->select(['id', 'receiver_id', 'title', 'created_at']);

        $received = $queryReceived->paginate(10, '*', 'rpage');
        $sent = $querySent->paginate(10, '*', 'spage');

        $requestedReceivedPage = request()->input('rpage', 1);
        $requestedSentPage = request()->input('spage', 1);
        $rpage = min($requestedReceivedPage, $received->lastPage());
        $spage = min($requestedSentPage, $sent->lastPage());
        if($rpage !== $requestedReceivedPage){
            $received = $queryReceived->paginate(10, '*', 'rpage', 1);
        }
        if($spage !== $requestedSentPage){
            $sent = $querySent->paginate(10, '*', 'spage', 1);
        }



        return response()->json([
            "received" => [
                "messages" => $received->items(),
                'page' => [
                    "current" => $received->currentPage(),
                    "last" => $received->lastPage(),
                    "total" => $received->total(),
                ]
            ],
            "sent" => [
                "messages" => $sent->items(),
                'page' => [
                    "current" => $sent->currentPage(),
                    "last" => $sent->lastPage(),
                    "total" => $sent->total(),
                ]
            ]
        ]);
    }
    function getMessagesSent()
    {
        $user = Auth::user();

        $sent = PrivateMessage::where('sender_id', $user->id)->where(function ($query) use ($user) {
            $query->where('deleted_by', '<>', $user->id)
                ->orWhereNull('deleted_by');
        })->with('receiver:id,nick')
            ->orderBy('created_at', 'desc')->select(['id', 'receiver_id', 'title', 'created_at'])->paginate(10);

        return response()->json([
            "messages" => $sent->items(),
            'page' => [
                "current" => $sent->currentPage(),
                "last" => $sent->lastPage(),
                "total" => $sent->total(),
            ]
        ]);
    }


    function getPrivateMessage(PrivateMessage $pm)
    {
        $user = Auth::user();
        $valid = $pm->receiver_id == $user->id || $pm->sender_id == $user->id;
        if (!$valid) {
            return response()->json([
                "message" => "Unauthorized"
            ], 403);
        }

        if ($user->id == $pm->receiver_id) {
            $pm->viewed = true;
            $pm->save();
        }

        $query = PrivateMessage::where('thread_id', $pm->thread_id)
        ->with(['sender:id,nick,avatar,public_role_id,created_at', 'sender.publicRole'])
        ->orderBy('created_at', 'desc');

        $thread = $query->paginate(10);
        $requestedPage = request()->input('page', 1);
        $page = min($requestedPage, $thread->lastPage());
        if($page !== $requestedPage){
            $thread = $query->paginate(10, ['*'], 'page', $page);
        }
        
        $pm->load('sender:nick,id,avatar,created_at,public_role_id','sender.publicRole');
        $recipient = $user->id == $pm->receiver_id ? $pm->sender_id : $pm->receiver_id;
        if ($thread->currentPage() != 1) {
            $pm = $pm->only('id', 'receiver_id', 'sender_id', 'thread_id', 'sender', 'title');
        };
        $response = [
            "message" => $pm,
            "thread" => $thread->items(),
            "recipient" => $recipient,
            'page' => [
                "current" => $thread->currentPage(),
                "last" => $thread->lastPage(),
                "total" => $thread->total()
            ]
        ];

        return response()->json($response, 200);
    }

    function newPrivateMessage(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            "title" => ['required'],
            "content" => ['required'],
            "recipient" => ["required", "exists:users,id", "not_in:$user->id"],
        ]);

        $newMessage =
            [
                'sender_id' => $user->id,
                'receiver_id' => $request->recipient,
                'title' => $request->title,
                'content' => $request->content,
            ];

        if ($request->thread_id) {
            $newMessage['thread_id'] = $request->thread_id;
            if (
                !PrivateMessage::where('thread_id', $request->thread_id)
                    ->where(function ($query) use ($user) {
                        $query->where('receiver_id', $user->id)
                            ->orWhere('sender_id', $user->id);
                    })->where(function ($query) use ($request) {
                $query->where('receiver_id', $request->recipient)
                    ->orWhere('sender_id', $request->recipient);
            })
                    ->first()
            ) {
                return response()->json([
                    "message" => "Unauthorized"
                ], 403);
            }
            ;
        }
        ;

        $pm = PrivateMessage::create($newMessage);

        return response()->json([
            'message' => "Private message seent successfully",
            'id' => $pm->id,
        ], 200);
    }

    function getThread(PrivateMessage $pm)
    {
        $user = Auth::user();
        if ($pm->sender_id != $user->id && $pm->receiver_id != $user->id) {
            return response()->json([
                "message" => "Unauthorized"
            ], 403);
        }

        return response()->json([
            'recipient' => $pm->sender_id == $user->id ? $pm->receiver_id : $pm->sender_id,
            'thread_id' => $pm->thread_id,
            'title' => $pm->title,
        ], 200);
    }
}