import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';

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

export default function EditSlide({ slide }: Props) {
    const [title, setTitle] = useState(slide.title || '');
    const [body, setBody] = useState(slide.body || '');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        slide.image_path ? `/storage/${slide.image_path}` : null
    );
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [processing, setProcessing] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', title);
        formData.append('body', body);
        if (image) {
            formData.append('image', image);
        }

        router.post(route('slides.update', slide.id), formData, {
            forceFormData: true,
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            }
        });
    };

    const handleBack = () => {
        router.get(route('slide-decks.show', slide.slide_deck.id));
    };

    const handleViewSlide = () => {
        router.get(route('slides.show', slide.id));
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
                                    🏔️ Edit Slide
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Editing slide in {slide.slide_deck.name}
                                </p>
                            </div>
                            <Button
                                onClick={handleViewSlide}
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-4xl">
                        <Card className="border-orange-200">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-800">
                                    Slide Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="title" className="text-gray-700">
                                            Slide Title
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Welcome to Laravel Best Practices"
                                            className={`mt-1 ${errors.title ? 'border-red-300' : 'border-orange-200 focus:border-orange-400'}`}
                                        />
                                        {errors.title && (
                                            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="body" className="text-gray-700">
                                            Slide Content
                                        </Label>
                                        <Textarea
                                            id="body"
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            placeholder="Enter your slide content here..."
                                            rows={8}
                                            className={`mt-1 ${errors.body ? 'border-red-300' : 'border-orange-200 focus:border-orange-400'}`}
                                        />
                                        {errors.body && (
                                            <p className="text-red-600 text-sm mt-1">{errors.body}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="image" className="text-gray-700">
                                            Slide Image (Optional)
                                        </Label>
                                        <div className="mt-1">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className={`${errors.image ? 'border-red-300' : 'border-orange-200 focus:border-orange-400'}`}
                                            />
                                            {errors.image && (
                                                <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                                            )}
                                        </div>
                                        
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {image ? 'New Image Preview:' : 'Current Image:'}
                                                </p>
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-md max-h-64 rounded-lg border border-orange-200"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setImage(null);
                                                            setImagePreview(slide.image_path ? `/storage/${slide.image_path}` : null);
                                                            const input = document.getElementById('image') as HTMLInputElement;
                                                            if (input) input.value = '';
                                                        }}
                                                        variant="outline"
                                                        size="sm"
                                                        className="absolute top-2 right-2 bg-white shadow-md"
                                                    >
                                                        {image ? 'Cancel' : 'Remove'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Saving...' : 'Save Changes'}
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