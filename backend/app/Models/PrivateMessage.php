<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Topic;
class PrivateMessage extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'thread_id',
        'content',
        'title',
    ];

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($message) {
            if (empty($message->thread_id)) {
                $lastMessage = PrivateMessage::latest()->first();
                $message->thread_id = $lastMessage ? $lastMessage->thread_id + 1 : 1;
            }
        });
    }
}
