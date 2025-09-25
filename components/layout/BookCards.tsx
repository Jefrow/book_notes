import { MessageSquareQuote } from "lucide-react";

interface bookProps {
  book: {
    title: string;
    author: string;
    rating: number;
    cover_url: string;
  };
}

function BookCards({ book }: bookProps) {
  const maxStars = 5;
  let rating = book.rating ?? 0;

  return (
    <div className="bookCardContainer max-w-6x-l mx-auto px-8 py-10 flex-col gap-2 bg-white shadow rounded p-4 justify-center">
      <div className="bookImage w-35 h-48 flex flex-shrink-0 content-center justify-center mx-auto">
        <img
          className="w-100"
          src={book.cover_url || "../src/assets/no-cover.png"}
          alt="book image"
        />
      </div>
      <p>{book.title}</p>
      <p>{book.author}</p>
      <div className="flex gap-1 mt-2">
        {Array.from({ length: maxStars }, (_, i) => (
          <span key={i} className="text-yellow-500 text-lg">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>

      <div></div>
    </div>
  );
}
export default BookCards;
