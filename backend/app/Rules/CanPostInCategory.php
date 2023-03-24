<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\Access\Gate;


use App\Models\Category;


class CanPostInCategory implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {   
        $category = Category::find($value);

        if (!$category) {
            $fail('Category not found');
        } else{
            $user = Auth::user();            
            if(!in_array($category->can_edit, $user->roles)){
               $fail('User not allowed');
            }
        }        
    }

}
