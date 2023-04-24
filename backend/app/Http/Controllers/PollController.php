<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollAnswer;

class PollController extends Controller
{
    function vote(PollOption $option)
    {
        $user = Auth::user();
        $poll = Poll::find($option->poll_id);
        if ($poll->finish_date != null && $poll->finish_date < now()) {
            return response()->json([
                "message" => "Poll already finished",
            ], 410);
        }
        if ($poll->voted($user->id)) {
            return response()->json([
                "message" => "Already voted on this poll.",
            ], 409);
        } else {
            PollAnswer::create([
                'poll_id' => $option->poll_id,
                'user_id' => $user->id,
                'poll_option_id' => $option->id,
            ]);

            return response()->json([
                "message" => "Voted successfully",
            ], 200);
        }
    }

    function getVotes(Poll $poll)
    {
        $user = Auth::user();
        $poll['votes'] = $poll->answers->count();
        $poll['options'] = $poll->options->map(function ($option) use ($user) {
            if ($user) {
                $option['voted'] = PollAnswer::where('poll_option_id', $option->id)->where('user_id', $user->id)->count() != 0;
            }
            $option['votes'] = $option->answers->count();
            return $option->only('id', 'option', 'votes', 'voted');
        });
        return response()->json(
            $poll->only('id', 'name', 'finish_date', 'votes', 'options')
            ,
            200
        );
    }

    function closePoll(Poll $poll)
    {
        $user = Auth::user();
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($poll->topic->category->can_mod, $user->roles);

        if (!$isAdmin && !$isMod && $user->id != $poll->topic->user_id) {
            return response()->json([
                "message" => "Unauthorized"
            ], 403);
        }

        $poll->finish_date = now();
        $poll->save();
        return response()->json([
            "message" => "Poll closed"
        ], 200);
    }

    function createPoll(Topic $topic, Request $request)
    {
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($topic->category->can_mod, $user->roles);

        $request->validate([
            'name' => ['required', 'min:3', 'max:50'],
            'options' => ['required', 'array', 'min:2', 'max:10'],
            'options.*' => ['array', 'min:1', 'max:2'],
            'options.*.option' => ['required', 'string']
        ]);
        // Checks if either the user has special permissions or the topic has a poll with votes.

        if (($user->id != $topic->user_id || $topic->poll->answers->count() != 0) && !$isAdmin && !$isMod) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $poll = Poll::updateOrCreate(
            [
                'id' => $topic->poll->id ?? Null,
            ],
            [
                'topic_id' => $topic->id,
                'name' => $request->name,
                'finish_date' => $request->finish_date ? Carbon::parse($request->finish_date) : Null,
            ]
        );

        $currentOptions = $poll->options()->pluck('option', 'id')->toArray();
        foreach ($request->options as $option) {
            if (isset($option['id'])) {
                PollOption::where('id', $option['id'])->update([
                    'option' => $option['option'],
                ]);
                unset($currentOptions[$option['id']]);
            } else {
                PollOption::create([
                    'option' => $option['option'],
                    'poll_id' => $poll->id,
                ]);
            }
        }
        PollOption::whereIn('id', array_keys($currentOptions))->delete();

        return response()->json(
            [
                'message' => 'Poll edited successfully',
                'id' => $topic->id
            ],
            200
        );
    }
    function editPoll(Poll $poll, Request $request)
    {
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($poll->topic->category->can_mod, $user->roles);

        if (!$poll->answers->count() == 0 && !$isAdmin && !$isMod) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

    }

    function getEditPoll(Topic $topic)
    {

        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($topic->poll->topic->category->can_mod, $user->roles);


        // if (($topic->poll->answers->count() != 0 || $user->id != $topic->user_id) && !$isAdmin && !$isMod) {

        //     return response()->json([
        //         'message' => 'Unauthorized',
        //     ], 403);
        // }

        if (($user->id != $topic->user_id || $topic->poll->answers->count() != 0) && !$isAdmin && !$isMod) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }


        // if($user->id != $topic->user_id){
        //     if($topic->poll->answers->count() != 0 ){
        //         if(!$isAdmin && !$isMod){
        //             return response()->json([
        //                 'message' => 'Unauthorized',
        //             ], 403);
        //         }
        //     }

        // }


        return response()->json([
            'poll' => $topic->poll->load('options'),
            'title' => $topic->only('title')['title'],
        ], 200);
    }

}