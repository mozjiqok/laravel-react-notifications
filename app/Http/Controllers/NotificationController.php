<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Notifications', [
            'notifications' => Notification::latest()->with('category')->paginate(20),
            'categories' => NotificationCategory::active()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:240',
            'text' => 'required',
            'category_id' => 'required|exists:notification_categories,id'
        ]);

        $notification = Notification::create([
            'title' => $validated['title'],
            'text' => $validated['text'],
            'category_id' => $validated['category_id'],
            'view_counter' => 0
        ]);

        $users = User::all();
        $notification->users()->attach($users->pluck('id'));

        return back()->with('success', 'Notification created successfully');
    }

    public function update(Request $request, Notification $notification)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|max:240',
            'text' => 'sometimes|required',
            'category_id' => 'required|exists:notification_categories,id'
        ]);

        $notification->update($validated);

        return back()->with('success', 'Notification updated successfully');
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return back()->with('success', 'Notification deleted successfully');
    }

    public function markAsRead(Notification $notification)
    {
        $user = auth()->user();
        $notification->markAsReadForUser($user);

        return back()->with('auth.unreadNotifications', $user->unreadNotifications()->get());
    }
}