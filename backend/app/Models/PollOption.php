<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PollOption extends Model
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

    
    public function answers(){
        return $this->hasMany(PollAnswer::class);
    }

    public function poll(){
        return $this->belongsTo(Poll::class,'poll_id');
    }
}
