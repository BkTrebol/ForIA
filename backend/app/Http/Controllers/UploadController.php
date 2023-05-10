<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    function uploadImage(Request $request){
        $request->validate([
            'file' => ['image','mimes:jpg,png,jpeg,gif,svg', 'max:200'],
        ]);

        $image = $request->file('file');
        if ($image){
            $image_path = $image->store('images');
        }
        $url = config('app.urlBackend');
        return response()->json([
            // "body" => [
                "imageUrl" => $url.'upload/'.$image_path
            // ]
            ]);
    }

    function getImage($disk,$image){
        if (Storage::disk($disk)->exists($image)){
            return response(Storage::disk($disk)->get($image),200);
        } else{
            return response()->json('e: '.$image,404);
        }
    }
}
