<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
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

    // Topic routes.
    Route::controller(TopicController::class)->prefix('topic')->group(function(){
        Route::post('/create','createTopic');
        Route::put('/{topic}','editTopic');
        Route::delete('/{topic}','deleteTopic');
    });
    //User Routes.
    Route::controller(UserController::class)->prefix('user')->group(function(){
        Route::get('/edit','getUserData');
        Route::get('/preference','getUserPreferences');
        Route::post('/edit','editUserData');
        Route::post('/preference','editUserPreference');
        Route::get('{user}','profile');
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
