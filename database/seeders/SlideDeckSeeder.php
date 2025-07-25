<?php

namespace Database\Seeders;

use App\Models\SlideDeck;
use App\Models\Slide;
use Illuminate\Database\Seeder;

class SlideDeckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a sample presentation about Laracon 2025
        $laraconDeck = SlideDeck::create([
            'name' => 'Welcome to Laracon 2025 - Denver Edition 🏔️'
        ]);

        // Create slides for the Laracon presentation
        $laraconSlides = [
            [
                'title' => 'Welcome to Laracon 2025!',
                'body' => "Join us in beautiful Denver, Colorado\n\nThree days of amazing Laravel content, networking, and mountain views.\n\n🏔️ Mile High City\n🚀 Cutting-edge Laravel\n🤝 Amazing Community",
                'order' => 0
            ],
            [
                'title' => 'What to Expect',
                'body' => "• 30+ Expert Speakers\n• Workshop Sessions\n• Networking Events\n• Rocky Mountain Views\n• Local Food & Craft Beer\n• Swag and Surprises",
                'order' => 1
            ],
            [
                'title' => 'Laravel 11 Highlights',
                'body' => "New Features & Improvements:\n\n✨ Enhanced Performance\n🔧 Improved Developer Experience\n📦 Better Package Management\n🛡️ Advanced Security Features\n🔄 Streamlined Updates",
                'order' => 2
            ],
            [
                'title' => 'Community Impact',
                'body' => "The Laravel community continues to grow:\n\n• 75+ million downloads\n• Active in 100+ countries\n• Thousands of packages\n• Vibrant ecosystem\n• Welcoming to newcomers",
                'order' => 3
            ],
            [
                'title' => 'Thank You!',
                'body' => "Questions?\n\nLet's build something amazing together!\n\n🙏 Thanks for being part of the Laravel community\n💙 See you around Denver!",
                'order' => 4
            ]
        ];

        foreach ($laraconSlides as $slideData) {
            Slide::create(array_merge($slideData, [
                'slide_deck_id' => $laraconDeck->id
            ]));
        }

        // Create additional sample decks
        SlideDeck::factory()
            ->has(Slide::factory()->count(5), 'slides')
            ->count(3)
            ->create();

        // Create a deck with mixed slide types
        $mixedDeck = SlideDeck::create([
            'name' => 'Laravel Best Practices & Tips'
        ]);

        Slide::factory()->titleOnly()->create([
            'slide_deck_id' => $mixedDeck->id,
            'title' => 'Laravel Best Practices',
            'order' => 0
        ]);

        Slide::factory()->create([
            'slide_deck_id' => $mixedDeck->id,
            'title' => 'Database Optimization',
            'body' => "• Use eager loading (with, load)\n• Add proper indexes\n• Use query scopes\n• Implement caching\n• Monitor slow queries",
            'order' => 1
        ]);

        Slide::factory()->withImage()->create([
            'slide_deck_id' => $mixedDeck->id,
            'title' => 'Testing Pyramid',
            'body' => "Build a solid testing foundation:\n\nUnit Tests → Feature Tests → Browser Tests",
            'order' => 2
        ]);
    }
}