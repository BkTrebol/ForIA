<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Poll;
use App\Models\Category;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/xd/{id}',function($id){
    $user = User::find($id);
    $pms = $user->privateTopics;
    $mps = $user->privateMessages;

    dd(['mps' => $pms,'things'=>$mps]);
});


Route::get('/dx/{id}',function($id){
    $poll = Poll::find($id);
    dd($poll->answers());

    dd($poll);
});

Route::get('/p/{id}',function($id){
    $poll = Poll::find(3);
    dd($poll->voted($id));

    dd($poll);
});

Route::get('/c/{id}',function($id){

    $cat = Category::find($id);
    dd($cat->lastPost);
    
});