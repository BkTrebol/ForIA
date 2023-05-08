<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function is_admin() {
        $user = Auth::user();
        return $user && $user->isAdmin();
    }

    public function roles() {
        $user = Auth::user();
        return $user && $user->hasVerifiedEmail() ? $user->roles()->pluck('role_id')->toArray() : [1];
    }
}
