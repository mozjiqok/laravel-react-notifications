<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'text',
        'view_counter',
        'category_id',
    ];
    
    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_user')
            ->withPivot('read_at')
            ->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(NotificationCategory::class, 'category_id');
    }

    public function markAsReadForUser(User $user)
    {
        $this->users()->syncWithoutDetaching([
            $user->id => ['read_at' => now()]
        ]);
        $this->view_counter++;
        $this->save();
    }

    public function scopeUnread($query, User $user)
    {
        return $query->whereDoesntHave('users', function ($q) use ($user) {
            $q->where('users.id', $user->id)
              ->whereNotNull('read_at');
        });
    }

    public function scopeVisibleForUser($query, $user)
    {
        return $query->whereDoesntHave('category.preferences', function($q) use ($user) {
            $q->where('user_id', $user->id)
            ->where('is_hidden', true);
        });
    }
}
