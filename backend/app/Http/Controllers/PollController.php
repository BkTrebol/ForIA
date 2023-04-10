<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollAnswer;

class PollController extends Controller
{
    function vote(PollOption $option){
        $user = Auth::user();
        $poll = Poll::find($option->poll_id);
        if ($poll->finish_date != null && $poll->finish_date < now()){
            return response()->json([
                "message" => "Poll already finished",
            ],410);
        }
        if ($poll->voted($user->id)){
            return response()->json([
                "message" => "Already voted on this poll.",
            ],409);
        } else {
            PollAnswer::create([
                'user_id' => $user->id,
                'poll_option_id' => $option->id,
            ]);

            return response()->json([
                "message" => "Voted successfully",
            ],200);
        }
    }

    function getVotes(Poll $poll){
        $user = Auth::user();
        $poll['votes'] = $poll->answers->count();
        $poll['options'] = $poll->options->map(function($option) use($user){
            if ($user){
                $option['voted'] = PollAnswer::where('poll_option_id',$option->id)->where('user_id',$user->id)->count() != 0;
            }
            $option['votes'] = $option->answers->count();
            return $option->only('id','option','votes','voted');         
        });
        return response()->json([
            "poll" => $poll->only('id','name','finish_date','votes','options')
        ],200);
    }

    function closePoll(Poll $poll){
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($poll->topic->category->can_mod,$user->roles);

        if(!$isAdmin && !$isMod && $user->id != $poll->topic->user_id ){
            return response()->json([
                "message" => "Unauthorized"
            ],403);
        }

        $poll->finish_date = now();
        $poll->save();
        return response()->json([
            "message" => "Poll closed"
        ],200);

    }
}
