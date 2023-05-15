<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mews\Purifier\Casts\CleanHtmlInput;
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

    protected $hidden = [
        'created_at',
        'updated_at',
        'poll_id'
    ];
    protected $casts = [
        'option' => CleanHtmlInput::class,
    ];

    public function answers(){
        return $this->hasMany(PollAnswer::class);
    }

    public function poll(){
        return $this->belongsTo(Poll::class, 'poll_id');
    }
}
