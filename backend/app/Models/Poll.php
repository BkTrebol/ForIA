<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Poll_option;

class Poll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'topic_id',
        'name',
        'finish_date',
    ];

    
    public function poll_options(){
        return $this->hasMany(Poll_option::class);
    }

    public function topic(){
        return $this->belongsTo(Topic::class,'topic_id');
    }
}
