import type { UserReviewData } from "../../src/types";
import DisplayBookRating from "../shared/DisplayBookRating";

function ReviewCards({ userReview }: UserReviewData) {
  return (
    <div
      className="review-card-container w-5/6 w-max-[1200px]
    px-4 py-6 m-auto shadow rounded-lg flex gap-4"
    >
      <div className="book-cover-container flex-shrink-0 w-32">
        <img
          src={userReview.book_cover_url || "../src/assets/no-cover.png"}
          alt="book-cover"
          className="w-full h-48 object-cover rounded shadow-md"
        />
      </div>
      <div className="book-info px-3 py-2 flex-1">
        <p className="text-sm text-gray-700 mb-4">{userReview.review_text}</p>
        <div className="book-info-container flex flex-wrap gap-4 items-center">
          <p className="text-sm italic text-gray-600">{userReview.book_title}</p>
          <p className="text-sm font-semibold text-gray-800">{userReview.author_name}</p>
          <DisplayBookRating rating={userReview.rating} />
        </div>
      </div>
    </div>
  );
}

export default ReviewCards;
