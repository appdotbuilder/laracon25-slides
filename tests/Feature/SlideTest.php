<?php

namespace Tests\Feature;

use App\Models\SlideDeck;
use App\Models\Slide;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SlideTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_slide_with_image()
    {
        Storage::fake('public');
        $slideDeck = SlideDeck::factory()->create();
        $image = UploadedFile::fake()->image('test.jpg', 800, 600);

        $response = $this->post('/slides', [
            'slide_deck_id' => $slideDeck->id,
            'title' => 'Test Slide',
            'body' => 'This is test content',
            'image' => $image
        ]);

        $slide = Slide::where('title', 'Test Slide')->first();
        $this->assertNotNull($slide);
        $this->assertNotNull($slide->image_path);
        $this->assertEquals(0, $slide->order);

        Storage::disk('public')->assertExists($slide->image_path);
        $response->assertRedirect(route('slide-decks.show', $slideDeck));
    }

    /** @test */
    public function it_can_update_a_slide()
    {
        Storage::fake('public');
        $slide = Slide::factory()->create([
            'title' => 'Original Title',
            'body' => 'Original Content'
        ]);

        $newImage = UploadedFile::fake()->image('updated.jpg');

        $response = $this->put("/slides/{$slide->id}", [
            'title' => 'Updated Title',
            'body' => 'Updated Content',
            'image' => $newImage
        ]);

        $slide->refresh();
        $this->assertEquals('Updated Title', $slide->title);
        $this->assertEquals('Updated Content', $slide->body);
        $this->assertNotNull($slide->image_path);

        Storage::disk('public')->assertExists($slide->image_path);
        $response->assertRedirect(route('slides.show', $slide));
    }

    /** @test */
    public function it_can_delete_a_slide()
    {
        Storage::fake('public');
        $slideDeck = SlideDeck::factory()->create();
        $slide = Slide::factory()->create([
            'slide_deck_id' => $slideDeck->id,
            'image_path' => 'slides/test.jpg'
        ]);

        // Create the fake file
        Storage::disk('public')->put('slides/test.jpg', 'fake content');

        $response = $this->delete("/slides/{$slide->id}");

        $this->assertDatabaseMissing('slides', [
            'id' => $slide->id
        ]);

        Storage::disk('public')->assertMissing('slides/test.jpg');
        $response->assertRedirect(route('slide-decks.show', $slideDeck));
    }

    /** @test */
    public function it_sets_correct_order_for_new_slides()
    {
        $slideDeck = SlideDeck::factory()->create();
        Slide::factory()->create(['slide_deck_id' => $slideDeck->id, 'order' => 0]);
        Slide::factory()->create(['slide_deck_id' => $slideDeck->id, 'order' => 1]);

        $this->post('/slides', [
            'slide_deck_id' => $slideDeck->id,
            'title' => 'Third Slide'
        ]);

        $newSlide = Slide::where('title', 'Third Slide')->first();
        $this->assertEquals(2, $newSlide->order);
    }

    /** @test */
    public function it_validates_slide_creation()
    {
        $response = $this->post('/slides', [
            'slide_deck_id' => 999, // Non-existent deck
            'title' => 'Test'
        ]);

        $response->assertSessionHasErrors('slide_deck_id');
    }

    /** @test */
    public function it_validates_image_upload()
    {
        $slideDeck = SlideDeck::factory()->create();
        $notAnImage = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->post('/slides', [
            'slide_deck_id' => $slideDeck->id,
            'title' => 'Test',
            'image' => $notAnImage
        ]);

        $response->assertSessionHasErrors('image');
    }
}