<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationPreferenceController;
use App\Http\Controllers\NotificationCategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/notifications/unread', [NotificationController::class, 'getUnreadNotifications'])
    ->middleware(['auth', 'verified'])
    ->name('notifications.unread');

Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
    ->middleware(['auth', 'verified'])
    ->name('notifications.read');

Route::resource('notifications', NotificationController::class)
    ->middleware(['auth', 'verified'])
    ->names([
        'index' => 'notifications.index',
        'create' => 'notifications.create',
        'store' => 'notifications.store',
        'show' => 'notifications.show',
        'edit' => 'notifications.edit',
        'update' => 'notifications.update',
        'destroy' => 'notifications.destroy'
    ]);

Route::resource('notification-categories', NotificationCategoryController::class)
    ->middleware(['auth', 'verified'])
    ->names([
        'index' => 'notification-categories.index',
        'create' => 'notification-categories.create',
        'store' => 'notification-categories.store',
        'show' => 'notification-categories.show',
        'edit' => 'notification-categories.edit',
        'update' => 'notification-categories.update',
        'destroy' => 'notification-categories.destroy'
    ]);

Route::post('/notifications/preferences/toggle-category', 
    [NotificationPreferenceController::class, 'toggleCategory'])
    ->middleware(['auth', 'verified'])
    ->name('notifications.preferences.toggle-category');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
