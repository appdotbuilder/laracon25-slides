import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Plus, Presentation, Edit3, Trash2, FileText } from 'lucide-react';

interface SlideDeck {
    id: number;
    name: string;
    slides_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    slideDecks: SlideDeck[];
    [key: string]: unknown;
}

export default function Welcome({ slideDecks }: Props) {
    const handleCreateDeck = () => {
        router.get(route('slide-decks.create'));
    };



    const handleViewDeck = (deckId: number) => {
        router.get(route('slide-decks.show', deckId));
    };

    const handlePresentDeck = (deckId: number) => {
        router.get(route('slide-decks.present', deckId));
    };

    const handleDeleteDeck = (deckId: number) => {
        if (confirm('Are you sure you want to delete this slide deck?')) {
            router.delete(route('slide-decks.destroy', deckId));
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header with Laracon 2025 Denver Theme */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            🏔️ Laracon 2025 Slides
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Denver Edition - Create stunning presentations for the conference
                        </p>
                        <Button 
                            onClick={handleCreateDeck}
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Create New Slide Deck
                        </Button>
                    </div>

                    {/* Slide Decks Grid */}
                    {slideDecks.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No slide decks yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Create your first slide deck to get started with your Laracon presentation
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slideDecks.map((deck) => (
                                <Card 
                                    key={deck.id} 
                                    className="hover:shadow-lg transition-shadow duration-200 border-orange-200 hover:border-orange-300"
                                >
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-gray-800 truncate">
                                            {deck.name}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">
                                            {deck.slides_count} slide{deck.slides_count !== 1 ? 's' : ''}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                onClick={() => handleViewDeck(deck.id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 min-w-0 border-orange-200 text-orange-700 hover:bg-orange-50"
                                            >
                                                <Edit3 className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            {deck.slides_count > 0 && (
                                                <Button
                                                    onClick={() => handlePresentDeck(deck.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 min-w-0 border-green-200 text-green-700 hover:bg-green-50"
                                                >
                                                    <Presentation className="mr-1 h-4 w-4" />
                                                    Present
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleDeleteDeck(deck.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3">
                                            Created {new Date(deck.created_at).toLocaleDateString()}
                                        </p>
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