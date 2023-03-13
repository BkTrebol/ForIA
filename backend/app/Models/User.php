<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\User_preference;
use App\Models\Private_message;
use App\Models\Post;
use App\Models\Topic;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nick',
        'email',
        'password',
        'location',
        'birthday',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'roles' => 'array',
    ];

    public function preferences()
    {
        return $this->hasOne(User_preference::class);
    }

    public function topics(){
        return $this->hasMany(Topic::class);
    }

    public function posts(){
        return $this->hasMany(Posts::class);
    }

    public function private_message(){
        return $this->hasMany(Private_message::class);
    }
}
