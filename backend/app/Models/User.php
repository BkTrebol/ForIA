<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


use App\Models\UserPreference;
use App\Models\PrivateMessage;
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
        'google_auth',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'google_auth',
        'suspension',
        'preferences',
        'roles',
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
        return $this->hasOne(UserPreference::class);
    }

    public function privateMessages(){
        return $this->hasMany(PrivateMessage::class,'receiver_id');
    }

    public function topics(){
        return $this->hasMany(Topic::class);
    }

    public function posts(){
        return $this->hasMany(Post::class);
    }

    public function last_post(){
        return $this->hasOne(Post::class)->orderBy('created_at','desc');
    }

    public function private_message_sender(){
        return $this->hasMany(PrivateMessage::class, 'sender_id');
    }

    public function private_message_reciever(){
        return $this->hasMany(PrivateMessage::class, 'receiver_id');
    }
}
