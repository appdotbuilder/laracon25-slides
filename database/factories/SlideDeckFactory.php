<?php

namespace Database\Factories;

use App\Models\SlideDeck;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SlideDeck>
 */
class SlideDeckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Laravel Best Practices 2025',
                'Building Scalable APIs with Laravel',
                'Modern PHP Development',
                'Database Optimization Techniques',
                'Testing Strategies for Laravel Apps',
                'Deployment and DevOps for Laravel',
                'Advanced Eloquent Relationships',
                'Security Best Practices',
                'Performance Monitoring and Debugging',
                'The Future of Laravel Development'
            ]),
        ];
    }
}