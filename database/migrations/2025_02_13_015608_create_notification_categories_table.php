<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::dropIfExists('user_notification_preferences');

        Schema::create('user_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('notification_categories')->onDelete('cascade');
            $table->boolean('is_hidden')->default(false);
            $table->unique(['user_id', 'category_id']);
            $table->timestamps();
        });

        Schema::dropIfExists('notifications');

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 240);
            $table->text('text');
            $table->integer('view_counter')->default(0);
            $table->foreignId('category_id')->constrained('notification_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_categories');

        Schema::dropIfExists('user_notification_preferences');
        
        Schema::create('user_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->boolean('is_hidden')->default(false);
            $table->unique(['user_id', 'category']);
            $table->timestamps();
        });

        Schema::dropIfExists('notifications');

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 240);
            $table->text('text');
            $table->integer('view_counter')->default(0);
            $table->string('category', 50)->default('other');
            $table->timestamps();
        });
    }
};
