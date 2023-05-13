<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminCategoryController extends Controller
{
    //

    function getList()
    {
        $user = Auth::user();
        // Gets al categories.
        $categories = Category::orderBy('order')->get()->groupBy('section')->map(
            function ($section, $sectionName) {
                $sectionTemp['name'] = $sectionName;
                $sectionTemp['categories'] = $section->map(function ($category) {
                    return $category;
                });

                return $sectionTemp;
            }
        )->values();
        return response()->json(
            [
            "categories" => $categories,
            "userMaxRole" => $user->roles()->orderBy('order','desc')->first()->order,
        ]
        ,200
        );
    }

    function saveCategory(Request $request)
    {
        $request->validate([
            "title" => [
                'required', Rule::unique('categories', 'title')
                    ->where(function ($query) use ($request) {
                        if ($request->has('id')) {
                            $query->where('id', '<>', $request->input('id'));
                        }
                        return $query;
                    })
            ],
            "can_view" => ['required', 'exists:roles,id'],
            "can_post" => ['required', 'exists:roles,id'],
            "can_mod" => ['required', 'exists:roles,id'],
            "image" => ['nullable', 'image'],
        ]);


        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('categories');
        }

        $category = Category::find($request->input("id"));
        if ($category && $category->image) {
            Storage::delete($category->image);
            $category->image = null;
            $category->save();
        }

        $data = [
            "section" => $request->input("section"),
            "title" => $request->input("title"),
            "can_view" => $request->input("can_view"),
            "can_post" => $request->input("can_post"),
            "can_mod" => $request->input("can_mod"),
            "description" => $request->input("description"),
            "image" => $image ?? null,
        ];

        $category = Category::updateOrCreate([
            "id" => $request->input("id")
        ], $data);
        return response()->json([
            "message" => 'Category updated successfully',
            "category" => $category
        ], 200);
    }

    function updateCategories(Request $request)
    {
        $newCategoryList = $request->categories;
        $oldCategoryList = Category::all()->pluck('id')->toArray();

        foreach ($newCategoryList as $i => $newCategory) {
            if (is_numeric($newCategory['id'])) {
                $oldCategory = Category::find($newCategory['id']);
                $oldCategory->update($newCategory);
                unset($oldCategoryList[array_search($oldCategory->id, $oldCategoryList)]);
            } 
        }
        ;

        foreach ($oldCategoryList as $category) {
            if (is_numeric($category)) {
                $oldCategory = Category::find($category);
                $oldCategory->delete();
            }
        }

        return response()->json('Categories updated successfully', 200);
    }

    function uploadImage(Category $category, Request $request)
    {
        $request->validate([
            'file' => ['image', 'mimes:jpg,png,jpeg,gif,svg', 'max:200'],
        ]);

        $image = $request->file('file');
        if ($image) {
            $image_path = $image->store('images');
        }

        $url = config('app.urlBackend');
        return response()->json([
            "imageUrl" => $url . 'upload/' . $image_path
        ]);
    }
}