<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;

use App\Models\Topic;

class CanPostInTopic implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $topic = Topic::find($value);

        if (!$topic) {
            $fail('Topic not found');
        } else{
            $user = Auth::user();            
            if(!in_array($topic->can_post, $user->roles) || !in_array($topic->category->can_post,$user->roles) ||
            !in_array($topic->can_view, $user->roles) || !in_array($topic->category->can_view,$user->roles)
            ){
               $fail('User not allowed');
            }
        }  
    }
}
