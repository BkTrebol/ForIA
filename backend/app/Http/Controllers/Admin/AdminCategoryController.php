<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    //

    function getList(){
                // Gets the categories that the user can view.

                $categories = Category::orderBy('order')->get()->groupBy('section')->map(
                    function ($section, $sectionName)  {
                        $sectionTemp['name'] = $sectionName;
                        $sectionTemp['categories'] = $section->map(function ($category) {
                            return $category;
                        });
                        
                        return $sectionTemp;
                    }
                )->values();
                return response()->json(
                    $categories,
                    200
                );
    }

    function updateCategories(Request $request){
        $newCategoryList = $request->categories;
        $oldCategoryList = Category::all()->pluck('id')->toArray();

        foreach ($newCategoryList as $i => $newCategory){
            if(is_numeric($newCategory['id'])){
                $oldCategory = Category::find($newCategory['id']);
                $oldCategory->update($newCategory);
                unset($oldCategoryList[array_search($oldCategory->id,$oldCategoryList)]);
            } else{
                Category::create($newCategory);
            }
            
        };

        foreach($oldCategoryList as $category){
            if(is_numeric($category)){
                $oldCategory = Category::find($category);
                $oldCategory->delete();
            }
        }

        return response()->json('Categories updated successfully');
    }
}
