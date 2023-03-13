<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Poll_answer;
use App\Models\Poll;

class Poll_option extends Model
{
    use HasFactory;
    
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'poll_id',
        'option',
    ];

    
    public function poll_answers(){
        return $this->hasMany(Poll_answer::class);
    }

    public function poll(){
        return $this->belongsTo(Poll::class,'poll_id');
    }
}
