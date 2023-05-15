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

    protected function is_admin(Request $request) {
        $user = Auth::user();
        if($request->session()->get('fakeRole',false)){
            return false;
        }
        return $user && $user->isAdmin();
    }

    protected function roles(Request $request) {
        $user = Auth::user();
        if($request->session()->get('fakeRole',false)){
            
            return $request->session()->get('fakeRole');
        }
        return $user && $user->hasVerifiedEmail() ? $user->roles()->pluck('role_id')->toArray() : [1];
    }

    protected function ban_words($content, $replace_char="*"){
        $censor = new CensorWords;
        $censor->setReplaceChar($replace_char);
        $langs = array('en-uk', 'en-us', 'es');
        $censor->setDictionary($langs);
        $content = $this->renameEntities($content);
        $content =  $censor->censorString($content)['clean'];
        return $this->restoreEntities($content);
    }

    private function renameEntities($html)
        {
            $entities = [
                '&lt;' => '__lt__',
                '&gt;' => '__gt__',
                '&amp;' => '__amp__',
                '&quot;' => '__quot__',
                '&apos;' => '__apos__',
            ];

            return strtr($html, $entities);
        }

    private function restoreEntities($html)
        {
            $entities = [
                '__lt__' => '&lt;',
                '__gt__' => '&gt;',
                '__amp__' => '&amp;',
                '__quot__' => '&quot;',
                '__apos__' => '&apos;',
            ];

            return strtr($html, $entities);
        }

}
