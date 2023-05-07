<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PrivateMessageController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\SidebarController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\RoleController;

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

    // User Routes.
    Route::controller(UserController::class)->prefix('user')->group(function(){
        Route::get('/edit','getUserData');
        Route::post('/edit','editUserData');
        Route::put('/password','changePassword');
        Route::get('/preference','getUserPreferences');
        Route::put('/preference','editUserPreference');
        Route::get('/list','getUserList');

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

        Route::get('/one-post/{post}', 'getOnePost');
        //Topic
        Route::get('/one-topic/{topic}','getOneTopic');
        Route::get('/all-topic','getAllTopic');
    });

    // Poll
    Route::controller(PollController::class)->prefix('poll')->group(function(){
        Route::put('/vote/{option}','vote');
        Route::get('/edit/{topic}','getEditPoll');
        Route::post('/create/{topic}','createPoll');
        Route::get('/close/{poll}','closePoll');
        Route::delete('/delete/{poll}','deletePoll');
    });

    // PrivateMessage
    Route::controller(PrivateMessageController::class)->prefix('pm')->group(function(){
        // Route::get('/received','getMessagesReceived');
        // Route::get('/sent','getMessagesSent');
        Route::get('','getMessages');
        Route::get('/reply/{pm}','getThread');
        Route::get('/{pm}','getPrivateMessage');
        Route::post('/new','newPrivateMessage');
        Route::delete('','deleteMessages');
        // Route::post('/','sendMessage');
    });

    Route::controller(UploadController::class)->prefix('upload')->group(function(){
        Route::post('/images','uploadImage');
    });

    Route::controller(SidebarController::class)->prefix('sidebar')->group(function(){
        Route::get('/userStats','getUserSidebarStats');
    });

// Admin routes.
    Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function(){
        Route::controller(AdminCategoryController::class)->prefix('category')->group(function(){
            Route::get('/list','getList');
            Route::post('/update','updateCategories');
        });

        Route::controller(RoleController::class)->prefix('role')->group(function(){
            Route::get('/all','getAll');
            Route::get('/','getList');
        });

        Route::controller(AdminUserController::class)->prefix('user')->group(function(){
            Route::get('/list','getList');
            Route::get('/user/{user}','getUser');
            Route::post('/update/{user}','updateUser'); 
            Route::delete('/user/{user}','deleteUser');
        });
    });
});

// Admin Login.
Route::controller(LoginController::class)->prefix('admin')->group(function(){
    Route::post('/login','login');
    Route::get('/check','checkAdmin');
});

// Public routes.
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    $user = $request->user();
    $roles = $user->roles;
    array_push($roles,'ROLE_USER');
    $user->roles = $roles;
    $user->save();
    return redirect()->away('http://localhost:4200');
})->middleware(['auth:sanctum','signed'])->name('verification.verify');


Route::controller(AuthController::class)->prefix('auth')->group(function(){
    Route::post('/register','register');
    Route::post('/login','login')->name('login');
    Route::post('/googleauth','googleAuth');
    Route::post('/googleconfirm','confirmGoogle');
    Route::get('/check-login','checkLogin');

    Route::get('/adminlogin/{user}','adminAuth'); // ADMIN
});

Route::controller(CategoryController::class)->prefix('category')->group(function(){
    Route::get('','getCategories');
    Route::get('/list','getCategoryList');
    Route::get('/{category}','viewCategory');
});

Route::controller(TopicController::class)->prefix('topic')->group(function(){
    Route::get('/{topic}','viewTopic');
});
Route::controller(PostController::class)->prefix('post')->group(function(){

});
Route::controller(PollController::class)->prefix('poll')->group(function(){
    Route::get('/{poll}','getVotes');
});

Route::controller(UserController::class)->prefix('user')->group(function(){
    Route::get('/get-avatar/{avatar}','getUserAvatar');
    Route::get('/profile/{user}','profile');
    Route::get('/statistics/{user}','getUserStatistics');
    Route::get('/statistics2/{user}','getUserStatistics2');

    Route::get('/publiclist','getUserListAdmin'); // ADMIN
});

Route::controller(UploadController::class)->prefix('upload')->group(function(){
    Route::get('/images/{image}','getImage');
});

Route::controller(SidebarController::class)->prefix('sidebar')->group(function(){
    Route::get('/lastFive','lastFive');
    Route::get('/forumStats','getForumStats');
});



// Testing Routes.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/checklogin', function (){
    $user = Auth::user();

    return response()->json([
        'logged' => $user ? true : false]
        ,200);
});


Route::get('testing/{post}', function(Post $post){
    $topic = Topic::find($post->topic_id);

    return response()->json(['post' => $topic->posts->count() ]);
});