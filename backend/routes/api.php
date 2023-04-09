<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

use App\Models\Post;
use App\Models\Topic;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function(){
    // Authentication routes.
    Route::controller(AuthController::class)->prefix('auth')->group(function(){
        Route::get('/data','userData');
        Route::get('/logout','logout');
    });
    //User Routes.
    Route::controller(UserController::class)->prefix('user')->group(function(){
        Route::get('/edit','getUserData');
        Route::post('/edit','editUserData');
        Route::put('/password','changePassword');
        Route::get('/preference','getUserPreferences');
        Route::put('/preference','editUserPreference');

        Route::get('{user}','profile');
    });


    // Topic routes.
    Route::controller(TopicController::class)->prefix('topic')->group(function(){
        Route::post('/','createTopic');
        Route::get('/edit/{topic}','getTopicData');
        Route::put('/{topic}','editTopic');
        Route::delete('/{topic}','deleteTopic');
    });

    // Post routes.
    Route::controller(PostController::class)->prefix('post')->group(function(){
        Route::post('/','createPost');
        Route::get('/edit/{post}','getPostData');
        Route::put('/{post}','editPost');
        Route::delete('/{post}','deletePost');
    });
    
});

// Public routes.
Route::controller(AuthController::class)->prefix('auth')->group(function(){
    Route::post('/register','register');
    Route::post('/login','login');
    Route::post('/googleauth','googleAuth');
    Route::post('/googleconfirm','confirmGoogle');
});

Route::controller(CategoryController::class)->prefix('category')->group(function(){
    Route::get('','getCategories');
    Route::get('/list','getCategoryList');
    Route::get('/{category}','viewCategory');
});

Route::controller(TopicController::class)->prefix('topic')->group(function(){
    Route::get('/{topic}','viewTopic');
});




// Testing Routes.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('holi',function(Request $request) {
    $request->validate([
        'nick' => ['required', 'string', 'max:255'],
        'password' => ['required', 'string', 'min:8'],
        'email' => ['required', 'string', 'max:255'],
    ], 
    );
});

Route::get('testing/{post}', function(Post $post){
    $topic = Topic::find($post->topic_id);
   
    return response()->json(['post' => $topic->posts->count() ]);
});