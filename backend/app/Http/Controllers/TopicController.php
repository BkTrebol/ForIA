<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Rules\CanPostInCategory;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\Paginator;

use App\Models\Category;
use App\Models\Topic;
use App\Models\Post;
use App\Models\Poll;
use App\Models\PollOption;

class TopicController extends Controller
{
    function viewTopic(Topic $topic,Request $request)
    {
        // Returns the posts in a topic if the user can view the topic and its category.
        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($topic->category->can_mod, $roles);

        if (!in_array($topic->category->can_view, $roles) || !in_array($topic->can_view, $roles)) {
            return response()->json(['message' => "Unauthorized"], 403);
        }

        $requestedPage = request()->input('page', 1);

        // $posts = $topic->load('user:id,nick,avatar,rol,created_at')->posts()->paginate(config('app.pagination.topic'));
        $queryPosts = $topic->load([
            'user:id,nick,avatar,created_at,public_role_id',
            'user.publicRole'
        ])->posts();
        $posts = $queryPosts->paginate(config('app.pagination.topic'));
        $page = min($requestedPage, $posts->lastPage());
        if($page !== $requestedPage){
            $posts = $queryPosts->paginate(config('app.pagination.topic'),'*','page',$page);
        }

        $poll = $topic->poll()->with(['options'])->first();
        if ($poll) {
            $poll['can_vote'] = !$user ? false :
                !$poll->voted($user->id) && ($poll->finish_date == null || $poll->finish_date > now());
            $poll['can_edit'] = ($poll->answers->count() == 0 && $user->id == $topic->user_id) || $isAdmin || $isMod;
            $poll['can_close'] = ($user && $user->id == $topic->user_id) || $isAdmin || $isMod;
        }

        $response = [
            'closed' => $topic->can_post === $topic->category->can_mod,
            'can_mod' => $isMod || $isAdmin,
            'can_edit' => $isMod || $isAdmin || ($user && $topic->user_id == $user->id && $topic->posts->count() == 0),
            'can_post' =>( in_array($topic->can_post, $roles) && in_array($topic->category->can_post,$roles)) || $isMod || $isAdmin,
            'can_poll' => $poll == null && (($user && $user->id == $topic->user_id) || $isAdmin || $isMod),
            'category' => $topic->category->only('id', 'title'),

            'posts' => $posts->map(function ($post) use($user,$request) {
                $post['can_edit'] = $this->checkPostPermission($post,$request);
                if($user && $user->preferences->filter_bad_words){
                    $post['content'] = self::ban_words($post->content);
                }
                return $post->load(['user:id,nick,avatar,created_at,public_role_id','user.publicRole'])->only('id', 'content', 'created_at', 'updated_at', 'can_edit', 'user','closed','can_mod');
            }),
            'poll' => $poll,
            'page' => [
                "current" => $posts->currentPage(),
                "last" => $posts->lastPage(),
                "total" => $posts->total()
            ],
        ];

        if ($posts->onFirstPage()) {
            $response['topic'] = $topic->only('id', 'title', 'created_at', 'updated_at', 'content', 'user');
        } else {
            $response['topic'] = $topic->only('id', 'title');
        }

        return response()->json($response, 200);
    }

    function toggleTopic(Topic $topic, Request $request){
        $user = Auth::user();
        $isAdmin = self::is_admin($request);
        $roles = self::roles($request);
        $isMod = in_array($topic->category->can_mod, $roles);
        if (!$isMod && !$isAdmin){
            return response()->json('Unauthorized',403);
        }
        if($topic->can_post === $topic->category->can_mod){
            $topic->can_post = 2;
            $message = 'Topic opened';
        }else{
            $topic->can_post = $topic->category->can_mod;
            $message = 'Topic closed';
        }

        $topic->save();
        return response()->json([
            'message' => $message,
        ],200);
    }

    function createTopic(Request $request)
    {
        // Creates a new topic if the user can view the containing category.
        $request->validate([
            'title' => ['required', 'min:3', 'max:255'],
            'category_id' => ['required', new CanPostInCategory],
            'description' => ['max:255'],
            'content' => ['required']
        ]);

        $topic = Topic::create([
            'category_id' => $request->category_id,
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'can_view' => $request->can_view??1,
            'can_post' => $request->can_post??2,
        ]);

        if ($request->has('poll') && $request->poll['name'] != '') {
            $request->validate([
                'poll.name' => ['required', 'min:3', 'max:50'],
                'poll.options' => ['required', 'array', 'min:2', 'max:10'],
                'poll.options.*' => ['array', 'min:1', 'max:2'],
                'poll.options.*.option' => ['required', 'string']
            ]);

            $poll = Poll::create([
                'topic_id' => $topic->id,
                'name' => $request->poll['name'],
                'finish_date' => $request->poll['finish_date'] ?? Null,
            ]);
            foreach ($request->poll['options'] as $option) {
                PollOption::create([
                    'option' => $option['option'],
                    'poll_id' => $poll->id,
                ]);
            }
        }

        return response()->json([
            'message' => 'Topic created successfully',
            'id' => $topic->id,
        ], 201);
    }

    function getTopicData(Topic $topic,Request $request)
    {
        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($topic->category->can_mod, $roles);

        if (!$isAdmin && !$isMod && $user->id != $topic->user_id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        $topic['can_edit'] = $topic->posts->count() == 0;

        return response()->json([
            "topic" => $topic->only('id', 'title', 'description', 'content', 'category_id', 'can_edit')
        ]);
    }

    function editTopic(Topic $topic, Request $request)
    {
        $request->validate([
            'title' => ['required', 'min:3', 'max:255'],
            'category_id' => ['required', new CanPostInCategory],
            'description' => ['max:255'],
            'content' => ['required']
        ]);

        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($topic->category->can_mod,$roles);
        // Edits/Creates poll if exists in request.

        // Checks if user owns the topic or can edit it.
        if (!$isMod && !$isAdmin && ($user->id != $topic->user->id || $topic->posts->count() > 0)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        // Checks if the user is trying to change topic category, and only allows it if it has can_mod role of the category,
        if ($topic->category_id != $request->category_id) {
            if (!$isAdmin && !$isMod) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            } else
                $topic->category_id = $request->category_id;
        }


        $topic->title = $request->title;
        $topic->description = $request->description;
        $topic->content = $request->content;
        $topic->can_view = $request->can_view;
        $topic->can_post = $request->can_post;
        $topic->update();
        return response()->json([
            'message' => 'Topic updated succesfully',
        ], 200);
    }

    function deleteTopic(Topic $topic, Request $request)
    {
        // Checks if user is admin, else if user has right to delete the topic.
        // If user is not admin just moves the topic to the Trash Category.
        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);

        if ($isAdmin) {
            $topic->delete();
            return response()->json(['message' => 'Topic deleted succesfully'], 200);
        } elseif (
            in_array($topic->category->can_mod,
            $roles) ||
            ($topic->user->id == $user->id && $topic->posts->count() <= 1)
        ) {
            $topic->category_id = config('app.trash');
            $topic->update();
            return response()->json(['message' => 'Topic deleted succesfully'], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
    }

    function getOneTopic(Topic $topic,Request $request)
    {
        $user = Auth::user();
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($topic->category->can_mod, $roles);

        if (!$isAdmin && !$isMod && $user->id != $topic->user_id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        $topic['is_admin'] = $isAdmin;
        $topic['is_mod'] = $isMod;
        $topic->makeHidden(['id','user_id','created_at','updated_at']);
        return response()->json([
            // "topic" => $topic->only('title', 'description', 'content', 'category_id'),
            "topic" => $topic,
            "category" => Category::where('id', $topic->category_id)->first()->only('title')
        ]);
    }

    function getRoles(Category $category,Request $request){
        $user = Auth::user();
        $userMaxrol = $user->roles()->orderBy('order','desc')->first()->order;
        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($category->can_mod, $roles);

        if (!$isAdmin && !$isMod) {
            return response()->json([], 200);
        }

        $roles = Role::where('order','<=',$userMaxrol)->orderBy('order')->get();
        return response()->json($roles,200);
    }
    function checkPostPermission(Post $post,Request $request)
    {
        $user = Auth::user();
        if (!$user)
            return false;

        $roles = self::roles($request);
        $isAdmin = self::is_admin($request);
        $isMod = in_array($post->topic->category->can_mod, $roles);
        if (!$isAdmin && !$isMod) {
            // IF the user isn't either an admin or a mod, checks if is the owner of the post and the post is the last one of the topic.
            if (
                $post->user_id != $user->id ||
                Post::where('topic_id', $post->topic_id)->orderBy('created_at',
                    'desc')->first()->id != $post->id
            ) {
                return false;
            }
        }
        return true;
    }
}