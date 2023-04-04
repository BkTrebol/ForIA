<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    function getCategories(){
        // Gets the categories that the user can view.
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        $categories = Category::with('lastPost')->get()->whereIn('can_view', $roles)->groupBy('section');

        return response()->json([
            'categories' => $categories,
        ],200);
    }

    function viewCategory(Category $category){
        // Returns the topics in a category that a user can view, if the user can view the category.
        $user = Auth::user();
        $roles = $user ? $user->roles : ['ROLE_GUEST'];
        if(!in_array($category->can_view,$roles)){
            return response()->json([
                'message' => 'Unauthorized'],403);
        }
        return response()->json([
            'category' => [
                'id' => $category->id,
                'title' => $category->title,
                'can_post' => in_array($category->can_post,$roles)],
                
            'topics'=>$category->topics->whereIn('can_view', $roles)
            ->map(function($topic){
                return $topic->only('id','user_id','title','description');
            }),
        ],200);
    }

}
