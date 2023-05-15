<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mews\Purifier\Casts\CleanHtmlInput;

class PublicRole extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        "name",
        "posts",
        "description"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'posts'
    ];
    protected $casts = [
        'name' => CleanHtmlInput::class,
        'description' => CleanHtmlInput::class,
    ];
    public function users()
    {
        return $this->hasMany(User::class);
    }

    protected static function boot()
    {
        parent::boot();
        // Updates user roles on delete.
        static::deleting(function ($publicRole) {
            $users = User::where('public_role_id', $publicRole->id)->get();
            foreach ($users as $user) {
                $role = PublicRole::where('posts', '<=', $user->posts->count())->orderByDesc('posts')->first();
                $user->publicRole()->associate($role);
                $user->save();
            }
        });
    }
}