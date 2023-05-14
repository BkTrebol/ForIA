<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use File;
class CategoryController extends Controller
{
    function getCategoryList()
    {
        $user = Auth::user();
        $roles = self::roles();
        return Category::whereIn('can_view', $roles)->select('id', 'title')->orderBy('order')->get();
    }

    function getCategories()
    {
        // Gets the categories that the user can view.
        $user = Auth::user();
        $roles = self::roles();

        $categories = Category::orderBy('order')->get()->whereIn('can_view', $roles)->groupBy('section')->map(
            function ($section, $sectionName) use ($roles) {
                $sectionTemp['name'] = $sectionName;
                $sectionTemp['categories'] = $section->map(function ($category) use ($roles) {
                    $lastPostTemp = $category->lastPost($roles)->first() ?? $category->lastTopic($roles)->first();
                    $lastPost = !$lastPostTemp ? null : [
                        'created_at' => $lastPostTemp->created_at,
                        'topic' => [
                            'id' => $lastPostTemp->topic->id ?? $lastPostTemp->id,
                            'title' => $lastPostTemp->topic->title ?? $lastPostTemp->title,
                            'last_page' => ceil($lastPostTemp->topic->posts->count() / config('app.pagination.topic')),
                        ],
                        'user' => [
                            'id' => $lastPostTemp->user->id,
                            'nick' => $lastPostTemp->user->nick,
                            'avatar' => $lastPostTemp->user->avatar,
                        ]
                    ];
                    $category['lastPost'] = $lastPost;
                    $category['posts'] = $category->posts->count();
                    $category['topics'] = $category->topics->count();
                    return $category->only('id', 'title', 'lastPost', 'description', 'image', 'posts', 'topics');
                });

                return $sectionTemp;
            }
        )->values();
        return response()->json(
            $categories,
            200
        );
    }

    function viewCategory(Category $category)
    {
        // Returns the topics in a category that a user can view, if the user can view the category.
        $user = Auth::user();

        $roles = self::roles();
        if (!in_array($category->can_view, $roles)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $queryTopics = $category->topics()->whereIn('can_view', $roles);
        $topics = $queryTopics->paginate(config('app.pagination.category'));

        $requestedPage = request()->input('page', 1);
        $page = min($requestedPage, $topics->lastPage());
        if($page !== $requestedPage){
            $topics = $queryTopics->paginate(config('app.pagination.category'), '*', 'page', $page);
        }


        return response()->json([
            'category' => [
                'id' => $category->id,
                'title' => $category->title,
                'can_post' => in_array($category->can_post, $roles)
            ],

            'topics' => $topics->map(function ($topic) {
                if ($topic->posts->count() > 0) {
                    $topic['last_post'] = $topic->last_post->load('user:avatar,nick,id')->only('user', 'created_at');
                } else {
                    $topic['last_post'] = $topic->load('user:avatar,nick,id')->only('user', 'created_at');
                }
                $topic['last_page'] = ceil($topic->posts->count() / config('app.pagination.topic'));
                $topic['posts'] = $topic->posts->count();
                return $topic->load('user:id,nick,avatar')->only('id', 'posts', 'user', 'title', 'description', 'created_at', 'last_post', 'last_page');
            }),
            'page' => [
                "current" => $topics->currentPage(),
                "last" => $topics->lastPage(),
                "total" => $topics->total()
            ]
        ], 200);
    }


    function getAllCategory() {
        $user = Auth::user();
        $roles = self::roles();
        return Category::whereIn('can_view', $roles)->select('id', 'title')->orderBy('section')->get();
    }

    function getMusic(Category $category) {
        if ($category->music != null && Storage::disk('music')->exists($category->music)){
            return response(Storage::disk('music')->get($category->music), 200);
        } else{
            return response(Storage::disk('music')->get('default.mp3'), 200);
            // $path = storage_path('app/music/default.mp3');
            // return response()->download($path);
        }
    }
}