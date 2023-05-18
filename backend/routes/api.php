<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PrivateMessageController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\SidebarController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Auth\PasswordResetController;

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
    Route::prefix('auth')->group(function(){
        Route::controller(LoginController::class)->group(function(){
            Route::get('/data','userData');
            Route::get('/logout','logout');

        });
        Route::controller(RegisterController::class)->group(function(){
            Route::get('/verify/{id}/{hash}','verifyEmail')
            ->middleware('signed')->name('verification.verify');
        });


    });

    // User Routes.
    Route::controller(UserController::class)->prefix('user')->group(function(){
        Route::get('/edit','getUserData');
        Route::post('/edit','editUserData');
        Route::put('/password','changePassword');

        Route::get('/list','getUserList');
        Route::post('/delete','deleteUser');

    });

    // Preferences Routes
    Route::controller(PreferencesController::class)->prefix('preferences')->group(function(){
        Route::get('/','getUserPreferences');
        Route::put('/sidebar','editSidebar');
        Route::put('/all','editUserPreference');
    });

    // Topic routes.
    Route::controller(TopicController::class)->prefix('topic')->group(function(){
        Route::post('/','createTopic');
        Route::get('/edit/{topic}','getTopicData');
        Route::get('toggle/{topic}','toggleTopic');
        Route::get('/roles/{category}','getRoles');
        Route::put('/{topic}','editTopic');
        Route::delete('/{topic}','deleteTopic');
        Route::get('one-topic/{topic}', 'getOneTopic');
    });

    // Category routes.
    Route::controller(CategoryController::class)->prefix('category')->group(function(){
        Route::get('all-category', 'getAllCategory');
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
        Route::get('','getMessages');
        Route::get('/reply/{pm}','getThread');
        Route::get('/{pm}','getPrivateMessage');
        Route::post('/new','newPrivateMessage');
        Route::delete('','deleteMessages');
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
            Route::post('/save','saveCategory');
            Route::delete('/empty','emptyTrash');
        });

        Route::controller(RoleController::class)->prefix('role')->group(function(){
            Route::get('/all/{filter?}','getAll');
            Route::get('/public','getPublic');
            Route::get('/normal','getList');
            Route::delete('/public/{role}','deletePublic');
            Route::delete('/administrative/{role}','deleteRole');
            Route::put('/administrative','editRole');
            Route::put('/public','editPublic');
            Route::post('/administrative','createRole');
            Route::post('/public','createPublic');
            Route::put('/save','saveRoles');

        });

        Route::controller(AdminUserController::class)->prefix('user')->group(function(){
            Route::get('/list','getList');
            Route::post('/check/nick','checkNick');
            Route::post('/check/email','checkEmail');
            Route::put('/update','updateUser');
            Route::get('/{user}','getUser');
            Route::delete('/{user}','deleteUser');
        });
    });
});

// Admin Login.
Route::controller(AdminLoginController::class)->prefix('admin')->group(function(){
    Route::post('/login','login');
    Route::get('/check','checkAdmin');
    Route::get('/adminlogin/{user}','adminAuth'); // ADMIN-DEBUG
    Route::get('/publiclist','getUserListAdmin'); // ADMIN-DEBUG
});

Route::controller(RoleController::class)->prefix('admin/role')->group(function(){
    Route::get('/fakeRoles','getFakeRoles');
    Route::post('/change','changeRole');
});

// Public routes.
Route::prefix('auth')->group(function(){
    Route::controller(LoginController::class)->group(function(){
        Route::post('/login','login')->name('login');
        Route::get('/check-login','checkLogin');
        Route::post('/googleauth','googleAuth');
        
    });
    Route::controller(RegisterController::class)->group(function(){
        Route::post('/register','register');
        Route::post('/googleconfirm','confirmGoogle');
        Route::get('/resendVerification','sendVerificationEmail');
    });

});

Route::controller(PasswordResetController::class)->prefix('auth')->group(function(){
    Route::post('/resetPassword','sendResetLink');
    Route::post('/password','reset');

});

Route::controller(CategoryController::class)->prefix('category')->group(function(){
    Route::get('','getCategories');
    Route::get('/list','getCategoryList');
    Route::get('/{category}','viewCategory');

    //Music
    Route::get('/music/{category}', 'getMusic');
});

Route::controller(TopicController::class)->prefix('topic')->group(function(){
    Route::get('/{topic}','viewTopic');
});


Route::controller(PollController::class)->prefix('poll')->group(function(){
    Route::get('/{poll}','getVotes');
});

Route::controller(UserController::class)->prefix('user')->group(function(){
    Route::get('/get-avatar/{avatar}','getUserAvatar');
    Route::get('/profile/{user}','profile');
    Route::get('/statistics/{user}','getUserStatistics');
    Route::get('/statistics2/{user}','getUserStatistics2');

});

Route::controller(UploadController::class)->prefix('upload')->group(function(){
    Route::get('/images/{disk}/{image}','getImage');
});

Route::controller(SidebarController::class)->prefix('sidebar')->group(function(){
    Route::get('/lastFive','getLastFive');
    Route::get('/forumStats','getForumStats');
});
