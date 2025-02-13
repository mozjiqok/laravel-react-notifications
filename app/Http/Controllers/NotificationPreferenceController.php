<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserNotificationPreference;
use App\Models\Notification;

class NotificationPreferenceController extends Controller
{
    public function toggleCategory(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:notification_categories,id'
        ]);

        $user = $request->user();
        $preference = $user->notificationPreferences()
            ->firstOrCreate(
                ['category_id' => $validated['category_id']],
                ['is_hidden' => false]
            );
        $preference->is_hidden = !$preference->is_hidden;
        $preference->save();

        return back()->with('success', 'Notification preference updated successfully');
    }
}
