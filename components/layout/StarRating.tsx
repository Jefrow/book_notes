import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

function StarRating({ rating, onChange }: RatingProps) {
  const bookRatings = [1, 2, 3, 4, 5];
  const [hovered, setHovered] = useState(0);

  return (
    <div className="felx gap-1">
      {bookRatings.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-yellow-400 hover:scale-110 transition"
        >
          <Star
            fill={(hovered || rating) >= star ? "currentColor" : "none"}
            stroke="currentColor"
            className="w-6 h-6"
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
