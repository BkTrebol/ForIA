<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Mews\Purifier\Casts\CleanHtmlInput;
class Role extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        "name","admin",'order'
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'name' => CleanHtmlInput::class,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
