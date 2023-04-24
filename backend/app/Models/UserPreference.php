<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class UserPreference extends Model
{
    use HasFactory;
        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'sidebar',
        'filter_bad_words',
        'allow_view_profile',
        'allow_user_to_mp',
        'hide_online_presence',
        'two_fa',
        'allow_music'
    ];

    protected $hidden =[
        'id','user_id','created_at','updated_at'
    ];

    protected $casts =[
        "sidebar"=> 'boolean',
        "filter_bad_words"=> 'boolean',
        "allow_view_profile"=> 'boolean',
        "allow_user_to_mp"=> 'boolean',
        "hide_online_presence"=> 'boolean',
        "two_fa" => 'boolean',
        "allow_music" => 'boolean'
    ];
    
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

}
