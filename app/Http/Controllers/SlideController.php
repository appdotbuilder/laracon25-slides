<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSlideRequest;
use App\Http\Requests\UpdateSlideRequest;
use App\Models\Slide;
use App\Models\SlideDeck;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SlideController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(SlideDeck $slide_deck)
    {
        return Inertia::render('slides/create', [
            'slideDeck' => $slide_deck
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSlideRequest $request)
    {
        $validated = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('slides', 'public');
            $validated['image_path'] = $imagePath;
        }

        // Set order if not provided
        if (!isset($validated['order'])) {
            $lastSlide = Slide::where('slide_deck_id', $validated['slide_deck_id'])
                ->orderBy('order', 'desc')
                ->first();
            $validated['order'] = $lastSlide ? $lastSlide->order + 1 : 0;
        }

        $slide = Slide::create($validated);
        $slideDeck = SlideDeck::find($validated['slide_deck_id']);

        return redirect()->route('slide-decks.show', $slideDeck)
            ->with('success', 'Slide created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Slide $slide)
    {
        $slide->load('slideDeck');

        return Inertia::render('slides/show', [
            'slide' => $slide
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Slide $slide)
    {
        $slide->load('slideDeck');

        return Inertia::render('slides/edit', [
            'slide' => $slide
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSlideRequest $request, Slide $slide)
    {
        $validated = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($slide->image_path) {
                Storage::disk('public')->delete($slide->image_path);
            }
            
            $imagePath = $request->file('image')->store('slides', 'public');
            $validated['image_path'] = $imagePath;
        }

        $slide->update($validated);

        return redirect()->route('slides.show', $slide)
            ->with('success', 'Slide updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slide $slide)
    {
        $slideDeck = $slide->slideDeck;
        
        // Delete image if exists
        if ($slide->image_path) {
            Storage::disk('public')->delete($slide->image_path);
        }
        
        $slide->delete();

        return redirect()->route('slide-decks.show', $slideDeck)
            ->with('success', 'Slide deleted successfully.');
    }
}