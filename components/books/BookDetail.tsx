import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookReviews } from "../../Routes/Api";
import type { BookReview } from "../../src/types";
import DisplayBookRating from "../shared/DisplayBookRating";

type BookInfo = {
  book_title: string;
  book_cover_url: string;
  author_name: string;
};

function BookDetail() {
  const { book_id } = useParams<{ book_id: string }>();
  const [book, setBook] = useState<BookInfo | null>(null);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!book_id) return;

    (async () => {
      try {
        const data = await getBookReviews(Number(book_id));
        setBook(data.book);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [book_id]);

  const extractUsername = (email: string) => {
    return email.split('@')[0];
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!book) return <div className="text-center mt-10">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Book Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex gap-6">
          {book.book_cover_url && (
            <img
              src={book.book_cover_url}
              alt={book.book_title}
              className="w-32 h-48 object-cover rounded shadow-md"
            />
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2">{book.book_title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author_name}</p>
            <p className="text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet. Be the first to review this book!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{extractUsername(review.user_email)}</span>
                <DisplayBookRating rating={review.rating} />
              </div>
              <p className="text-gray-700">{review.review_text}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookDetail;
