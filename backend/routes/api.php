<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
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
Route::controller(AuthController::class)->prefix('auth')->name('auth.')->group(function(){
    Route::post('/register','register')->name('register');
    Route::post('/login','login')->name('login');
});

Route::controller(AuthController::class)->middleware('auth:sanctum')->group(function(){
    Route::get('/holita','holi');
});

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
