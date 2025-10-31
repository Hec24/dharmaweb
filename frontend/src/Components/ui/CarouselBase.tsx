import React, { useState, useEffect, useRef } from "react";

interface CarouselBaseProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  itemsToShow?: number;
  breakpoints?: { [width: number]: number }; // {640: 1, 1024: 2, ...}
  className?: string;
}

export function CarouselBase<T>({
  items,
  renderItem,
  itemsToShow = 3,
  breakpoints = { 640: 1, 1024: 2, 1536: 3 },
  className = "",
}
: CarouselBaseProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(itemsToShow);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      let slides = itemsToShow;
      const sorted = Object.keys(breakpoints)
        .map(Number)
        .sort((a, b) => a - b);
      for (const bp of sorted) {
        if (window.innerWidth < bp) {
          slides = breakpoints[bp];
          break;
        }
      }
      setSlidesToShow(slides);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsToShow, breakpoints]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slidesToShow]);

  const maxIndex = Math.max(items.length - slidesToShow, 0);

  const nextSlide = () => {
    if (isTransitioning || currentIndex >= maxIndex) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (carouselRef.current && itemRefs.current[0]) {
      const itemWidth = itemRefs.current[0].offsetWidth;
      carouselRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, slidesToShow]);

  const showLeft = currentIndex > 0;
  const showRight = currentIndex < maxIndex;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Navigation buttons */}
      {showLeft && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full  hover:bg-linen transition-colors -ml-2 md:-ml-4 border border-gold/30"
          aria-label="Anterior"
        >
          ‹
        </button>
      )}
      {showRight && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full hover:bg-linen transition-colors -mr-2 md:-mr-4 border border-gold"
          aria-label="Siguiente"
        >
          ›
        </button>
      )}
      <div className="overflow-x-hidden">
        <div ref={carouselRef} className="w-full max-w-full overflow-x-hidden py-4" style={{ position: "relative" }}>
          <div className="flex transition-transform duration-500 ease-in-out">
            {items.map((item, idx) => (
              <div
                key={idx}
                ref={el => { itemRefs.current[idx] = el; }}
                className="flex-shrink-0 px-3"
                style={{
                  flex: `0 0 ${100 / slidesToShow}%`,
                  maxWidth: `${100 / slidesToShow}%`,
                  minWidth: 0,
                }}
              >
                {renderItem(item, idx)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
