<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Snipe\BanBuilder\CensorWords;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function is_admin(Request $request) {
        $user = Auth::user();
        if($request->session()->get('fakeRole',false)){
            return false;
        }
        return $user && $user->isAdmin();
    }

    public function roles(Request $request) {
        $user = Auth::user();
        if($request->session()->get('fakeRole',false)){
            
            return $request->session()->get('fakeRole');
        }
        return $user && $user->hasVerifiedEmail() ? $user->roles()->pluck('role_id')->toArray() : [1];
    }

    public function ban_words($content, $replace_char="*"){
        $censor = new CensorWords;
        $censor->setReplaceChar($replace_char);
        $langs = array('en-uk', 'en-us', 'es');
        $censor->setDictionary($langs);
        return $censor->censorString($content)['clean'];
    }
}
