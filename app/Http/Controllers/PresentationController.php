<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SlideDeck;
use Inertia\Inertia;

class PresentationController extends Controller
{
    /**
     * Display the slide deck in presentation mode.
     */
    public function show(SlideDeck $slide_deck)
    {
        $slide_deck->load('slides');

        return Inertia::render('slide-decks/present', [
            'slideDeck' => $slide_deck
        ]);
    }
}