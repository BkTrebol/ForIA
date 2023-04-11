<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Rules\CanPostInCategory;
use Illuminate\Support\Facades\Validator;

use App\Models\Topic;
use App\Models\Post;
use App\Models\Poll;
use App\Models\PollOption;

class TopicController extends Controller
{
    function viewTopic(Topic $topic){
        // Returns the posts in a topic if the user can view the topic and its category.
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        if(!in_array($topic->category->can_view,$roles) || !in_array($topic->can_view,$roles) )
        return response()->json(['message' => "Unauthorized"],403);
        else
        $posts = $topic->load('user:id,nick,avatar,rol,created_at')->posts()->paginate(config('app.pagination.topic'));
        $response =  [
            'can_edit' => in_array($topic->category->can_mod,$roles) || ($user && $topic->user_id == $user->id),
            'can_post' => in_array($topic->can_post,$roles),
            'category' => $topic->category->only('id','title'),

            'posts' => $posts->map(function($post){
                $post['can_edit'] = $this->checkPostPermission($post);
                return $post->load('user:id,nick,avatar,rol,created_at')->only('id','content','created_at','updated_at','can_edit','user');
            }),
            'poll' => !$topic->poll ? null : $topic->poll()->with(['options'])->get()->map(function($poll) use($user){
                $poll['can_vote'] = !$user ? false : 
                !$poll->voted($user->id) && ($poll->finish_date == null || $poll->finish_date > now()) 
;
                return $poll;
            }),
            "current_page" => $posts->currentPage(),
            "last_page" => $posts->lastPage(),
            "total" => $posts->total()
        ];
        if($posts->onFirstPage()){
            $response['topic'] = $topic->only('id','title','created_at','updated_at','content','user');
        } else {
            $response['topic'] = $topic->only('id','title');
        }

        return response()->json($response,200);
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
            'content' => $request->content,
        ]);

        if ($request->has('poll')){
            $request->validate([
                'poll.name' => ['required','min:3','max:50'],
                'poll.options' => ['required','array','min:2'],
                'poll.options.*' => ['string','max:100']
            ]);

            $poll = Poll::create([
                'topic_id' => $topic->id,
                'name' => $request->poll['name'],
                'finish_date' => $request->poll['finish_date']??Null,
            ]);
            foreach ($request->poll['options'] as $option){
                PollOption::create([
                    'option' => $option,
                    'poll_id' => $poll->id,
                ]);
            }
        }

        return response()->json([
            'message' => 'Topic created successfully',
            'topic' => $topic,
        ],201);
    }

    function getTopicData(Topic $topic){
        $user = Auth::user();
        $roles = $user->roles;
        $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
        $isMod = in_array($topic->category->can_mod,$user->roles);

        if (!$isAdmin && !$isMod && $user->id != $topic->user_id){
            return response()->json([
                'message' => 'Unauthorized',
            ],403);
        }
        $topic['can_edit'] = $topic->posts->count() == 0;
        if ($topic->poll){
            $topic->load('poll.options');
            $topic->poll['can_edit'] = $topic->poll->answers->count() == 0 || $isAdmin ||$isMod;
        }
        return response()->json([
            "topic" => $topic->only('id','title','description','content','category_id','poll','can_edit')
        ]);
    }

    function editTopic(Topic $topic,Request $request){
        $request->validate([
            'title' => ['required','min:3','max:255'],
            'category_id' => ['required',new CanPostInCategory],
            'description' => ['max:255'],
            'content' => ['required']
         ]);

         $user = Auth::user();
         $isAdmin = count(collect($user->roles)->intersect(config('app.adminRoles'))) > 0;
         $isMod = in_array($topic->category->can_mod,$user->roles);
         // Edits/Creates poll if exists in request.
         if ($request->has('poll')){
            $request->validate([
                'poll.name' => ['required','min:3','max:50'],
                'poll.options' => ['required','array','min:2','max:10'],
                'poll.options.*' => ['array','min:1','max:2'],
                'poll.options.*.option' => ['required','string']
            ]);
            // Checks if either the user has special permissions or the topic has a poll with votes.
            if ($topic->poll && $topic->poll->answers->count() != 0 && !$isAdmin && !$isMod){
                return response()->json([
                    'message' => 'Unauthorized',
                ],403);
            }

            $poll = Poll::updateOrCreate([
                'id' => $topic->poll->id??Null,
            ],
                ['topic_id' => $topic->id,
                'name' => $request->poll['name'],
                'finish_date' => $request->poll['finish_date']??Null,]
            );

            $currentOptions = $poll->options()->pluck('option','id')->toArray();
            foreach ($request->poll['options'] as $option){
                if (isset($option['id'])){
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
            PollOption::whereIn('id',array_keys($currentOptions))->delete();       
        }

         // Checks if user owns the topic or can edit it.
         if (!$isMod && !$isAdmin && ($user->id != $topic->user->id || $topic->posts->count() > 0)) {
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
         $topic->content = $request->content;
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


    function checkPostPermission(Post $post){
        $user = Auth::user();
        if (!$user) return false;
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
}
