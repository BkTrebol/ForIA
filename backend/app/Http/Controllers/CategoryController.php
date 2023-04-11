<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{   
    function getCategoryList(){
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        return Category::whereIn('can_view', $roles)->select('id','title')->orderBy('section')->get();
    }

    function getCategories(){
        // Gets the categories that the user can view.
        $user = Auth::user();   
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        $categories = Category::get()->whereIn('can_view', $roles)->groupBy('section')->map(function($section,$sectionName)use($roles){
           $abc['categories'] = $section->map(function($category) use($roles){
        $post = $category->lastPost;
        $category['can_post'] = in_array($category->can_post,$roles);
        $category['lastPost'] = [
                'created_at' => $post->created_at,
                'topic' => [
                    'id' => $post->topic->id,
                    'title' => $post->topic->title,
                ],
                'user' =>[
                    'id' => $post->user->id,
                    'nick' =>$post->user->nick,
                    'avatar' => $post->user->avatar,
                ]
                ];
        return $category->only('id','title','lastPost','description','image','can_post');
            });
            $abc['name'] = $sectionName;
            return $abc;
        })->values();
        return response()->json(
             $categories,
            200);
    }

    function viewCategory(Category $category){
        // Returns the topics in a category that a user can view, if the user can view the category.
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        if(!in_array($category->can_view,$roles)){
            return response()->json([
                'message' => 'Unauthorized'],403);
        }
        $topics = $category->topics()->whereIn('can_view', $roles)->paginate(config('app.pagination.category'));
        return response()->json([
            'category' => [
                'id' => $category->id,
                'title' => $category->title,
                'can_post' => in_array($category->can_post,$roles)],
                
            'topics'=>$topics->map(function($topic){
                return $topic->load('user:id,nick,avatar')->only('id','user','title','description');
            }),
            "current_page" => $topics->currentPage(),
            "last_page" => $topics->lastPage(),
            "total" => $topics->total()
        ],200);
    }

}
