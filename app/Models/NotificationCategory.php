<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'color',
        'description',
        'is_active',
    ];

    public function preferences()
    {
        return $this->hasMany(UserNotificationPreference::class, 'category_id');
    }

    public static function active()
    {
        return self::where('is_active', true)->get();
    }
}