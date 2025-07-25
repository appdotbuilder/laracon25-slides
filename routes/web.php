<?php

use App\Http\Controllers\SlideDeckController;
use App\Http\Controllers\SlideController;
use App\Http\Controllers\PresentationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Slide Decks List (main functionality)
Route::get('/', [SlideDeckController::class, 'index'])->name('home');

// Slide Deck routes (excluding index since it's on home)
Route::resource('slide-decks', SlideDeckController::class)->except(['index']);
Route::get('slide-decks/{slide_deck}/present', [PresentationController::class, 'show'])->name('slide-decks.present');

// Slide routes
Route::get('slide-decks/{slide_deck}/slides/create', [SlideController::class, 'create'])->name('slides.create');
Route::resource('slides', SlideController::class)->except(['index', 'create']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
