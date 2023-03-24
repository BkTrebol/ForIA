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
    Route::controller(AuthController::class)->prefix('auth')->name('auth.')->group(function(){
        Route::get('/data','userData')->name('userData');
        Route::get('/logout','logout')->name('logout');
    });


    // Topic routes.
    Route::controller(TopicController::class)->prefix('topic')->name('topic.')->group(function(){
        Route::post('/create','createTopic')->name('create');
        Route::put('/{topic}','editTopic')->name('edit');
        Route::delete('/{topic}','deleteTopic')->name('delete');
    });

    //User Routes.
    Route::controller(UserController::class)->prefix('user')->name('user.')->group(function(){
        Route::get('/edit','getUserData')->name('edit');
        Route::get('/preference','getUserPreferences')->name('preferences');
        Route::post('/edit','editUserData')->name('editUser');
        Route::post('/preference','editUserPreference')->name('editPreference');
        Route::get('{user}','profile')->name('profile');
    });

});

// Public routes.

    Route::controller(AuthController::class)->prefix('auth')->name('auth.')->group(function(){
        Route::post('/register','register')->name('register');
        Route::post('/login','login')->name('login');
        Route::post('/googleauth','googleAuth')->name('googleauth');
        Route::post('/googleconfirm','confirmGoogle')->name('googleconfirm');
    });
    
    Route::controller(CategoryController::class)->prefix('category')->name('category.')->group(function(){
        Route::get('','getCategories')->name('list');
        Route::get('/{category}','viewCategory')->name('view');
    });
    
    Route::controller(TopicController::class)->prefix('topic')->name('topic.')->group(function(){
        Route::get('/{topic}','viewTopic')->name('view');
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
