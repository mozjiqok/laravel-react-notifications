<?php

namespace App\Http\Controllers;

use App\Models\NotificationCategory;
use App\Models\Notification;
use App\Models\UserNotificationPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationCategoryController extends Controller
{
    public function index()
    {
        $categories = NotificationCategory::where('is_active', true)->paginate(20);
        return Inertia::render('NotificationCategories', [
            'categories' => $categories
        ]);
    }

    public function create()
    {
        return Inertia::render('NotificationCategories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'color' => 'nullable',
            'description' => 'nullable',
        ]);

        NotificationCategory::create($validated);

        return back()->with('success', 'Category created successfully');
    }

    public function edit(NotificationCategory $notificationCategory)
    {
        return Inertia::render('NotificationCategories/Edit', [
            'category' => $notificationCategory
        ]);
    }

    public function update(Request $request, NotificationCategory $notificationCategory)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'color' => 'nullable',
            'description' => 'nullable',
        ]);

        $notificationCategory->update($validated);

        return back()->with('success', 'Category updated successfully');
    }

    public function destroy(NotificationCategory $notificationCategory)
    {
        $notificationCategory->update(['is_active' => false]);

        return back()->with('success', 'Category deleted successfully');
    }
}