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

                $categories = Category::get()->groupBy('section')->map(
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

    function updateCategories(){
        
    }
}
