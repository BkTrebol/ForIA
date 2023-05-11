<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\PollOption;
use App\Models\User;

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

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function options(){
        return $this->hasMany(PollOption::class);
    }

    public function answers(){
        return $this->hasManyThrough(PollAnswer::class, PollOption::class);
    }

    public function voted(int $user_id){
        return $this->hasManyThrough(PollAnswer::class, PollOption::class)->where('user_id','=',$user_id)->exists();
    }

    public function topic(){
        return $this->belongsTo(Topic::class, 'topic_id');
    }
}
