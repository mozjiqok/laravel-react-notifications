<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function notifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_user')
            ->withPivot('read_at')
            ->withTimestamps()
            ->with('category:id,name,color');
    }
    
    public function unreadNotifications()
    {
        return $this->notifications()
            ->whereNull('notification_user.read_at')
            ->whereHas('category', function($query) {
                $query->where('is_active', true);
            });
    }

    public function notificationPreferences()
    {
        return $this->hasMany(UserNotificationPreference::class);
    }

    public function isNotificationCategoryHidden(string $category)
    {
        return $this->notificationPreferences()
            ->where('category', $category)
            ->where('is_hidden', true)
            ->exists();
    }

    public function toggleNotificationCategory(string $category)
    {
        $preference = $this->notificationPreferences()
            ->firstOrCreate(
                ['category' => $category],
                ['is_hidden' => true]
            );

        $preference->is_hidden = !$preference->is_hidden;
        $preference->save();

        return $preference->is_hidden;
    }

    public function getHiddenNotificationCategories()
    {
        return $this->notificationPreferences()
            ->where('is_hidden', true)
            ->pluck('category');
    }
}
