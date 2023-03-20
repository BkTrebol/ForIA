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
        'topic_id',
        'user_id',
        'user2_id',
    ];

    
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function user2(){
        return $this->belongsTo(User::class,'user2_id');
    }

    public function topic()
    {
        return $this->hasOne(Topic::class);
    }
}
