import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';



export default function CreateSlideDeck() {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(route('slide-decks.store'), 
            { name },
            {
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onSuccess: () => {
                    setProcessing(false);
                }
            }
        );
    };

    const handleBack = () => {
        router.get(route('home'));
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            🏔️ Create New Slide Deck
                        </h1>
                        <p className="text-lg text-gray-600">
                            Start building your Laracon 2025 presentation
                        </p>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl">
                        <Card className="border-orange-200">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-800">
                                    Slide Deck Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="name" className="text-gray-700">
                                            Presentation Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g., Laravel Best Practices 2025"
                                            className={`mt-1 ${errors.name ? 'border-red-300' : 'border-orange-200 focus:border-orange-400'}`}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing || !name.trim()}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create Slide Deck'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBack}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}