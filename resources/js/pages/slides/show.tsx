import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, Edit3, Presentation } from 'lucide-react';

interface SlideDeck {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Slide {
    id: number;
    slide_deck_id: number;
    title: string | null;
    body: string | null;
    image_path: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    slide_deck: SlideDeck;
}

interface Props {
    slide: Slide;
    [key: string]: unknown;
}

export default function ShowSlide({ slide }: Props) {
    const handleBack = () => {
        router.get(route('slide-decks.show', slide.slide_deck.id));
    };

    const handleEdit = () => {
        router.get(route('slides.edit', slide.id));
    };

    const handlePresent = () => {
        router.get(route('slide-decks.present', slide.slide_deck.id));
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="mb-4 border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to {slide.slide_deck.name}
                        </Button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    🏔️ Slide Preview
                                </h1>
                                <p className="text-lg text-gray-600">
                                    From {slide.slide_deck.name}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleEdit}
                                    variant="outline"
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                >
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit Slide
                                </Button>
                                <Button
                                    onClick={handlePresent}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Presentation className="mr-2 h-4 w-4" />
                                    Present Deck
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Slide Preview */}
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-orange-200 shadow-lg">
                            <CardContent className="p-8">
                                {/* Slide Title */}
                                {slide.title && (
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                                        {slide.title}
                                    </h2>
                                )}

                                {/* Slide Image */}
                                {slide.image_path && (
                                    <div className="mb-6 text-center">
                                        <img
                                            src={`/storage/${slide.image_path}`}
                                            alt="Slide content"
                                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                )}

                                {/* Slide Body */}
                                {slide.body && (
                                    <div className="prose prose-lg max-w-none">
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {slide.body}
                                        </div>
                                    </div>
                                )}

                                {/* Empty slide message */}
                                {!slide.title && !slide.body && !slide.image_path && (
                                    <div className="text-center py-16">
                                        <p className="text-xl text-gray-500 mb-4">
                                            This slide is empty
                                        </p>
                                        <Button
                                            onClick={handleEdit}
                                            className="bg-orange-600 hover:bg-orange-700 text-white"
                                        >
                                            <Edit3 className="mr-2 h-4 w-4" />
                                            Add Content
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Navigation hint */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                This is how your slide will appear in presentation mode
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}