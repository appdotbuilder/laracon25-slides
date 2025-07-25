import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X, Square } from 'lucide-react';

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

export default function PresentSlideDeck({ slideDeck }: Props) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [, setIsFullscreen] = useState(false);

    const slides = slideDeck.slides;
    const currentSlide = slides[currentSlideIndex];
    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === slides.length - 1;

    const nextSlide = useCallback(() => {
        if (!isLastSlide) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    }, [isLastSlide, currentSlideIndex]);

    const prevSlide = useCallback(() => {
        if (!isFirstSlide) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    }, [isFirstSlide, currentSlideIndex]);

    const handleExit = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        router.get(route('slide-decks.show', slideDeck.id));
    }, [slideDeck.id]);

    const enterFullscreen = useCallback(() => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(() => {
                // Fullscreen failed, continue anyway
                setIsFullscreen(false);
            });
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            enterFullscreen();
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, [enterFullscreen]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowRight':
                case ' ':
                    event.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    prevSlide();
                    break;
                case 'Escape':
                    event.preventDefault();
                    handleExit();
                    break;
                case 'f':
                case 'F':
                    event.preventDefault();
                    toggleFullscreen();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, handleExit, toggleFullscreen]);

    // Auto-enter fullscreen on load
    useEffect(() => {
        const timer = setTimeout(() => {
            enterFullscreen();
        }, 500);
        return () => clearTimeout(timer);
    }, [enterFullscreen]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (slides.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">No slides to present</h1>
                    <Button
                        onClick={handleExit}
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-gray-900"
                    >
                        Back to Deck
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col relative">
            {/* Header with controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold text-white/90">
                        🏔️ {slideDeck.name}
                    </h1>
                    <span className="text-sm text-white/70">
                        {currentSlideIndex + 1} / {slides.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={toggleFullscreen}
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/20"
                    >
                        <Square className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleExit}
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/20"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-6xl w-full text-center">
                    {/* Slide Title */}
                    {currentSlide.title && (
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-orange-400">
                            {currentSlide.title}
                        </h2>
                    )}

                    {/* Slide Image */}
                    {currentSlide.image_path && (
                        <div className="mb-8 flex justify-center">
                            <img
                                src={`/storage/${currentSlide.image_path}`}
                                alt="Slide content"
                                className="max-w-full max-h-96 rounded-lg shadow-2xl border border-orange-400/20"
                            />
                        </div>
                    )}

                    {/* Slide Body */}
                    {currentSlide.body && (
                        <div className="prose prose-xl prose-invert max-w-none">
                            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg md:text-2xl">
                                {currentSlide.body}
                            </div>
                        </div>
                    )}

                    {/* Empty slide message */}
                    {!currentSlide.title && !currentSlide.body && !currentSlide.image_path && (
                        <div className="text-center py-16">
                            <p className="text-2xl text-gray-400 mb-4">
                                This slide is empty
                            </p>
                            <p className="text-gray-500">
                                Slide {currentSlideIndex + 1} of {slides.length}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    onClick={prevSlide}
                    disabled={isFirstSlide}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 disabled:opacity-30"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                    {currentSlideIndex + 1} / {slides.length}
                </div>
                <Button
                    onClick={nextSlide}
                    disabled={isLastSlide}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 disabled:opacity-30"
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Left/Right click areas for navigation */}
            <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={prevSlide} />
            <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={nextSlide} />

            {/* Keyboard shortcuts hint */}
            <div className="absolute bottom-4 right-4 text-xs text-white/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div>← → Navigate • F Fullscreen • ESC Exit</div>
            </div>
        </div>
    );
}