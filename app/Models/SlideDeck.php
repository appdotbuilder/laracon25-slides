<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SlideDeck
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Slide> $slides
 * @property-read int|null $slides_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck query()
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SlideDeck whereUpdatedAt($value)
 * @method static \Database\Factories\SlideDeckFactory factory($count = null, $state = [])
 * @method static SlideDeck create(array $attributes = [])
 * @method static SlideDeck firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class SlideDeck extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the slides for the slide deck.
     */
    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy('order');
    }
}