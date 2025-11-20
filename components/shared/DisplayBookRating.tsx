interface BookRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export default function DisplayBookRating({
  rating,
  maxStars = 5,
}: BookRatingProps) {
  return (
    <div className="flex gap-1 content-center">
      {Array.from({ length: maxStars }).map((_, index) => (
        <span key={index} className="text-yellow-500 text-lg">
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
