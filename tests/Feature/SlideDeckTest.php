<?php

namespace Tests\Feature;

use App\Models\SlideDeck;
use App\Models\Slide;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SlideDeckTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_display_slide_decks_list()
    {
        $slideDeck = SlideDeck::factory()->create(['name' => 'Test Presentation']);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('slideDecks')
        );
    }

    /** @test */
    public function it_can_create_a_slide_deck()
    {
        $response = $this->post('/slide-decks', [
            'name' => 'My New Presentation'
        ]);

        $this->assertDatabaseHas('slide_decks', [
            'name' => 'My New Presentation'
        ]);

        $slideDeck = SlideDeck::where('name', 'My New Presentation')->first();
        $response->assertRedirect(route('slide-decks.show', $slideDeck));
    }

    /** @test */
    public function it_can_show_a_slide_deck()
    {
        $slideDeck = SlideDeck::factory()->create();
        $slide = Slide::factory()->create(['slide_deck_id' => $slideDeck->id]);

        $response = $this->get("/slide-decks/{$slideDeck->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('slide-decks/show')
                ->has('slideDeck')
        );
    }

    /** @test */
    public function it_can_create_a_slide()
    {
        Storage::fake('public');
        $slideDeck = SlideDeck::factory()->create();
        $image = UploadedFile::fake()->image('slide.jpg');

        $response = $this->post('/slides', [
            'slide_deck_id' => $slideDeck->id,
            'title' => 'Test Slide',
            'body' => 'This is a test slide',
            'image' => $image
        ]);

        $this->assertDatabaseHas('slides', [
            'slide_deck_id' => $slideDeck->id,
            'title' => 'Test Slide',
            'body' => 'This is a test slide'
        ]);

        $slide = Slide::where('title', 'Test Slide')->first();
        $this->assertNotNull($slide->image_path);
        Storage::disk('public')->assertExists($slide->image_path);
    }

    /** @test */
    public function it_can_present_a_slide_deck()
    {
        $slideDeck = SlideDeck::factory()->create();
        Slide::factory()->count(3)->create(['slide_deck_id' => $slideDeck->id]);

        $response = $this->get("/slide-decks/{$slideDeck->id}/present");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('slide-decks/present')
                ->has('slideDeck')
                ->has('slideDeck.slides', 3)
        );
    }

    /** @test */
    public function it_validates_slide_deck_creation()
    {
        $response = $this->post('/slide-decks', [
            'name' => ''
        ]);

        $response->assertSessionHasErrors('name');
    }

    /** @test */
    public function it_can_delete_a_slide_deck()
    {
        $slideDeck = SlideDeck::factory()->create();

        $response = $this->delete("/slide-decks/{$slideDeck->id}");

        $this->assertDatabaseMissing('slide_decks', [
            'id' => $slideDeck->id
        ]);

        $response->assertRedirect(route('home'));
    }
}