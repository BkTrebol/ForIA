<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Topic;
class Category extends Model
{
    use HasFactory;

    
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'image',
        'music',
        'can_view',
        'section',
    ];

    
    public function topics(){
        return $this->hasMany(Topic::class)->orderBy('updated_at','desc');
    }
    public function posts(){
        return $this->hasManyThrough(Post::class,Topic::class);
    }

    public function lastPost(){
        return $this->hasOneThrough(Post::class,Topic::class)->with('user')->orderBy('created_at','desc');
    }
}
