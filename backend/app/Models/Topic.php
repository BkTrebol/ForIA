<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Database\Eloquent\Relations\HasOne;
// use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Poll;

class Topic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'user_id',
        'title',
        'description',
        'can_view',
        'can_edit',
        'content',
    ];

    public function posts(){
        return $this->hasMany(Post::class)->orderBy('created_at','asc');
    }

    public function last_post(){
        return $this->hasOne(Post::class)->orderBy('created_at','desc');
    }

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function category(){
        return $this->belongsTo(Category::class,'category_id');
    }

    public function poll(){
        return $this->hasOne(Poll::class);
    }

}
