<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mews\Purifier\Casts\CleanHtmlInput;

use App\Models\User;
use App\Models\Topic;
class Post extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'topic_id',
        'user_id',
        'content',
    ];

    protected $touches = ['topic'];

    protected $casts = [
        'content' => CleanHtmlInput::class,
    ];
    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function topic(){
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    protected static function boot(){
        parent::boot();

        static::saved(function($post){
            $post->topic->touch();
        });

        static::created(function ($post) {
            $user = $post->user;
            if($user->publicRole->posts !== null){
                $role = PublicRole::where('posts', '<=', $user->posts->count())->orderByDesc('posts')->first();
                if ( $role->id !== $user->publicRole->id ){
                    $user->publicRole()->associate($role);
                    $user->save();
                }
            }
        });

        static::deleted(function ($post) {
            $user = $post->user;
            if($user->publicRole->posts !== null){
                $role = PublicRole::where('posts', '<=', $user->posts->count())->orderByDesc('posts')->first();
                if ( $role->id !== $user->publicRole->id ){
                    $user->publicRole()->associate($role);
                    $user->save();
                }
            }
        });
    }
}
