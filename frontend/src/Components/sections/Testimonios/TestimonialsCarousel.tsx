// src/Components/sections/TestimonialsCarousel.tsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import { testimonialsData, programFilters } from "../../../data/testimonios";
import SectionHeader from "../../ui/SectionHeader";

const TestimonialsCarousel: React.FC = () => {
  const headingId = useId();
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return activeFilter === "Todos"
      ? testimonialsData
      : testimonialsData.filter((t) => t.program === activeFilter);
  }, [activeFilter]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      prev();
    }
  };

  const currentTestimonial = filtered[currentIndex];

  if (!currentTestimonial) return null;

  return (
    <section
      id="testimonios"
      className="relative py-20 md:py-28 bg-[var(--color-linen)] overflow-hidden"
      aria-labelledby={headingId}
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Voces de nuestr@s Participantes"
          subtitle="Voces reales de personas que ya están caminando con nosotras."
          align="center"
          className="mb-10"
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {programFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeFilter === filter
                  ? "bg-asparragus text-white shadow-md transform scale-105"
                  : "bg-white/50 text-asparragus hover:bg-white hover:shadow-sm"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 border border-white/50 h-[500px] flex flex-col justify-center transition-all duration-300"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Decorative Quote */}
            <div className="absolute top-8 left-8 text-gold/20">
              <FaQuoteLeft size={60} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center animate-fadeIn">
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-gold">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="fill-current w-5 h-5" />
                ))}
              </div>

              {/* Text */}
              <blockquote className="font-degular text-base sm:text-lg md:text-xl text-gray-700 italic leading-relaxed mb-8 max-w-2xl">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="mt-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-asparragus p-[2px] mx-auto mb-3">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-gotu text-asparragus">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                </div>
                <cite className="not-italic">
                  <span className="block font-gotu text-lg text-asparragus">
                    {currentTestimonial.name}
                  </span>
                  <span className="block text-sm text-gray-500 font-medium">
                    {currentTestimonial.program} • {currentTestimonial.date}
                  </span>
                </cite>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-asparragus hover:bg-asparragus hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold md:-left-6"
              aria-label="Anterior testimonio"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-asparragus hover:bg-asparragus hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold md:-right-6"
              aria-label="Siguiente testimonio"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          {/* Dots Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {filtered.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${idx === currentIndex
                    ? "w-8 bg-asparragus"
                    : "w-2 bg-asparragus/30 hover:bg-asparragus/50"
                  }
                `}
                aria-label={`Ir al testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
