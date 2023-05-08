<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $hidden = [
        'created_at',
        'updated_at',
        // 'topic_id',
    ];
    
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
