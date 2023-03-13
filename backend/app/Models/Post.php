<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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


    
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    
    public function topic(){
        return $this->belongsTo(Topic::class,'topic_id');
    }
}
