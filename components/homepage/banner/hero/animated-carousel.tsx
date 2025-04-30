"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchDataPagination } from "@/utils/api-utils";
import { Banner } from "@/utils/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface AnimatedCarouselProps {
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  activeOnly?: boolean; // New prop to filter active banners
}

export function AnimatedCarousel({
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  activeOnly = true, // Default to only showing active banners
}: AnimatedCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = (await fetchDataPagination("banners")) as {
          data: Banner[];
        };

        const filteredBanners = activeOnly
          ? response.data.filter((banner) => banner.isActive)
          : response.data;

        setBanners(filteredBanners);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {}
    };

    fetchBanners();
  }, [activeOnly]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || banners.length === 0) return;

      setIsAnimating(true);
      setCurrentIndex(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating, banners.length]
  );

  const goToNextSlide = useCallback(() => {
    if (banners.length === 0) return;
    const newIndex = (currentIndex + 1) % banners.length;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, banners.length]);

  const goToPrevSlide = useCallback(() => {
    if (banners.length === 0) return;
    const newIndex = (currentIndex - 1 + banners.length) % banners.length;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, banners.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || banners.length === 0) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, goToNextSlide, autoPlayInterval, isPaused, banners.length]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel container */}
      <div className="relative h-[600px] w-full overflow-hidden ">
        {banners &&
          banners.length > 0 &&
          banners?.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out",
                index === currentIndex
                  ? "translate-x-0 opacity-100"
                  : index < currentIndex
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              )}
            >
              <Image
                src={slide?.image?.url || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2 animate-fadeIn">
                  {slide.title}
                </h2>
                <p className="animate-fadeIn animation-delay-200">
                  {slide.description}
                </p>
                {slide.targetUrl && (
                  <Button
                    asChild
                    variant="secondary"
                    className="mt-4 animate-fadeIn animation-delay-400"
                  >
                    <a
                      href={slide.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Navigation controls */}
      {showControls && banners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none rounded-full"
            onClick={goToPrevSlide}
            disabled={isAnimating}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none rounded-full"
            onClick={goToNextSlide}
            disabled={isAnimating}
          >
            <ChevronRight className="h-6 w-6 text-white" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/80"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
