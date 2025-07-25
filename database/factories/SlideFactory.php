<?php

namespace Database\Factories;

use App\Models\Slide;
use App\Models\SlideDeck;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Slide>
 */
class SlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slide_deck_id' => SlideDeck::factory(),
            'title' => $this->faker->sentence(4),
            'body' => $this->faker->randomElement([
                "Welcome to Laracon 2025!\n\nJoin us in beautiful Denver, Colorado for three days of amazing Laravel content, networking, and mountain views.",
                "Key Laravel Features:\n\n• Eloquent ORM\n• Artisan CLI\n• Blade Templating\n• Route Model Binding\n• Job Queues\n• Broadcasting",
                "Performance Tips:\n\n1. Use eager loading to avoid N+1 queries\n2. Implement proper caching strategies\n3. Optimize database indexes\n4. Use queue workers for heavy tasks",
                "Testing Best Practices:\n\n• Write feature tests for user workflows\n• Use factories for test data\n• Mock external services\n• Test edge cases and error conditions",
                "Security Considerations:\n\n• Validate all user input\n• Use CSRF protection\n• Implement proper authentication\n• Sanitize output to prevent XSS\n• Keep dependencies updated"
            ]),
            'order' => $this->faker->numberBetween(0, 10),
        ];
    }

    /**
     * Create a slide with an image.
     */
    public function withImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image_path' => 'slides/sample-slide-' . random_int(1, 5) . '.jpg',
        ]);
    }

    /**
     * Create a title-only slide.
     */
    public function titleOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'body' => null,
            'image_path' => null,
        ]);
    }
}