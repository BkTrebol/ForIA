<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Snipe\BanBuilder\CensorWords;

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

    public function ban_words($content, $replace_char="*"){
        $censor = new CensorWords;
        $censor->setReplaceChar($replace_char);
        $langs = array('en-uk', 'en-us', 'es');
        $badwords = $censor->setDictionary($langs);
        return $censor->censorString($content)['clean'];
    }
}
