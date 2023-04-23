<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    function getCategoryList()
    {
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        return Category::whereIn('can_view', $roles)->select('id', 'title')->orderBy('section')->get();
    }

    function getCategories()
    {
        // Gets the categories that the user can view.
        $user = Auth::user();
        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        $categories = Category::get()->whereIn('can_view', $roles)->groupBy('section')->map(
            function ($section, $sectionName) use ($roles) {
                $abc['categories'] = $section->map(function ($category) use ($roles) {
                    $post = $category->lastPost;
                    $category['topics'] = $category->topics->count();
                    if ($post) {
                        $category['posts'] = $category->posts->count();
                        $category['lastPost'] = [
                            'created_at' => $post->created_at,
                            'topic' => [
                                'id' => $post->topic->id,
                                'title' => $post->topic->title,
                            ],
                            'user' => [
                                'id' => $post->user->id,
                                'nick' => $post->user->nick,
                                'avatar' => $post->user->avatar,
                            ]
                        ];
                    }
                    return $category->only('id', 'title', 'lastPost', 'description', 'image', 'posts', 'topics');
                });
                $abc['name'] = $sectionName;
                return $abc;
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

        $roles = $user && $user->hasVerifiedEmail() ? $user->roles : ['ROLE_GUEST'];
        if (!in_array($category->can_view, $roles)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $topics = $category->topics()->whereIn('can_view', $roles)->paginate(config('app.pagination.category'));
        $requestedPage = request()->input('page', 1);
        if ($topics->lastPage() < $requestedPage) {
            $topics = $category->topics()->whereIn('can_view', $roles)->paginate(config('app.pagination.category'), '*', 'page', $topics->lastPage());
        } else if ($requestedPage <= 0) {
            $topics = $category->topics()->whereIn('can_view', $roles)->paginate(config('app.pagination.category'), '*', 'page', 1);
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

}