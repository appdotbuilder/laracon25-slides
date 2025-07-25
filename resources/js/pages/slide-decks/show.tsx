import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, Plus, Edit3, Trash2, Presentation, Save, Image as ImageIcon } from 'lucide-react';

interface Slide {
    id: number;
    title: string | null;
    body: string | null;
    image_path: string | null;
    order: number;
    created_at: string;
    updated_at: string;
}

interface SlideDeck {
    id: number;
    name: string;
    slides: Slide[];
    created_at: string;
    updated_at: string;
}

interface Props {
    slideDeck: SlideDeck;
    [key: string]: unknown;
}

export default function ShowSlideDeck({ slideDeck }: Props) {
    const [deckName, setDeckName] = useState(slideDeck.name);
    const [isEditing, setIsEditing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleUpdateDeckName = () => {
        setProcessing(true);
        router.put(route('slide-decks.update', slideDeck.id), 
            { name: deckName },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                }
            }
        );
    };

    const handleBack = () => {
        router.get(route('home'));
    };

    const handleCreateSlide = () => {
        router.get(route('slides.create', slideDeck.id));
    };

    const handleEditSlide = (slideId: number) => {
        router.get(route('slides.edit', slideId));
    };

    const handleDeleteSlide = (slideId: number) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            router.delete(route('slides.destroy', slideId));
        }
    };

    const handlePresentDeck = () => {
        router.get(route('slide-decks.present', slideDeck.id));
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
                            Back to Slide Decks
                        </Button>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-4">
                                        <Input
                                            value={deckName}
                                            onChange={(e) => setDeckName(e.target.value)}
                                            className="text-2xl font-bold border-orange-200 focus:border-orange-400"
                                        />
                                        <Button
                                            onClick={handleUpdateDeckName}
                                            disabled={processing}
                                            size="sm"
                                            className="bg-orange-600 hover:bg-orange-700 text-white"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setDeckName(slideDeck.name);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-300"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-4xl font-bold text-gray-900">
                                            🏔️ {slideDeck.name}
                                        </h1>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                            size="sm"
                                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {slideDeck.slides.length > 0 && (
                                <Button
                                    onClick={handlePresentDeck}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                                >
                                    <Presentation className="mr-2 h-5 w-5" />
                                    Present
                                </Button>
                            )}
                        </div>

                        <p className="text-lg text-gray-600">
                            {slideDeck.slides.length} slide{slideDeck.slides.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Add Slide Button */}
                    <div className="mb-8">
                        <Button
                            onClick={handleCreateSlide}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add New Slide
                        </Button>
                    </div>

                    {/* Slides List */}
                    {slideDeck.slides.length === 0 ? (
                        <Card className="border-orange-200">
                            <CardContent className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <ImageIcon className="mx-auto h-16 w-16" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No slides yet
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Add your first slide to start building your presentation
                                </p>
                                <Button
                                    onClick={handleCreateSlide}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Slide
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slideDeck.slides.map((slide, index) => (
                                <Card 
                                    key={slide.id}
                                    className="hover:shadow-lg transition-shadow duration-200 border-orange-200 hover:border-orange-300 cursor-pointer"
                                    onClick={() => handleEditSlide(slide.id)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg text-gray-800 truncate">
                                                    {slide.title || `Slide ${index + 1}`}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">
                                                    Slide {index + 1}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 ml-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditSlide(slide.id);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="p-1 h-8 w-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSlide(slide.id);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="p-1 h-8 w-8 border-red-200 text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {slide.image_path && (
                                            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={`/storage/${slide.image_path}`}
                                                    alt="Slide preview"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        )}
                                        {slide.body && (
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {slide.body}
                                            </p>
                                        )}
                                        {!slide.body && !slide.image_path && (
                                            <p className="text-sm text-gray-400 italic">
                                                Empty slide - click to edit
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}