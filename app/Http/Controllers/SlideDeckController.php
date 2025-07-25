<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSlideDeckRequest;
use App\Http\Requests\UpdateSlideDeckRequest;
use App\Models\SlideDeck;
use Inertia\Inertia;

class SlideDeckController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $slideDecks = SlideDeck::withCount('slides')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('welcome', [
            'slideDecks' => $slideDecks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('slide-decks/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSlideDeckRequest $request)
    {
        $slideDeck = SlideDeck::create($request->validated());

        return redirect()->route('slide-decks.show', $slideDeck)
            ->with('success', 'Slide deck created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SlideDeck $slideDeck)
    {
        $slideDeck->load('slides');

        return Inertia::render('slide-decks/show', [
            'slideDeck' => $slideDeck
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SlideDeck $slideDeck)
    {
        return Inertia::render('slide-decks/edit', [
            'slideDeck' => $slideDeck
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSlideDeckRequest $request, SlideDeck $slideDeck)
    {
        $slideDeck->update($request->validated());

        return redirect()->route('slide-decks.show', $slideDeck)
            ->with('success', 'Slide deck updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SlideDeck $slideDeck)
    {
        $slideDeck->delete();

        return redirect()->route('home')
            ->with('success', 'Slide deck deleted successfully.');
    }
}