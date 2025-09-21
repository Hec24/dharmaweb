// components/ui/TestimonialCard.tsx
import React from "react";

interface TestimonialCardProps {
  name: string;
  date: string;
  rating: number;
  text: string;
  program: string;
}

const renderStars = (rating: number) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-gold" : "text-pale"}>
        ★
      </span>
    ))}
  </div>
);

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  date,
  rating,
  text,
  program,
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gold/10">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-gotu text-xl text-asparragus">{name}</h3>
        <p className="text-sm text-asparragus/80 mb-2">{date}</p>
      </div>
      {renderStars(rating)}
    </div>
    <p className="text-asparragus/90 italic mb-4 font-degular leading-relaxed">"{text}"</p>
    <span className="inline-block px-3 py-1 text-xs rounded-full bg-mossgreen/10 text-mossgreen font-medium">
      {program}
    </span>
  </div>
);

export default TestimonialCard;
