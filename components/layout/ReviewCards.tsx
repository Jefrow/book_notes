import type { UserReviewData } from "../../src/types";
import DisplayBookRating from "../shared/DisplayBookRating";

function ReviewCards({ userReview }: UserReviewData) {
  return (
    <div
      className="review-card-container w-5/6 w-max-[1200px]
    px-4 py-6 m-auto shadow rounded-lg flex "
    >
      <div className="book-cover-container aspect-5/8 bg-transparent rounded">
        <img
          src={userReview.book_cover_url || "../src/assets/no-cover.png"}
          alt="book-cover"
          className="w-full object-fit"
        />
      </div>
      <div className="book-info px-5 py-2">
        <p>{userReview.review_text}</p>
        <div className="book-info-container flex w-full gap-5 py-6 content-center">
          <p className="italic">{userReview.book_title}</p>
          <p className="font-semibold">{userReview.author_name}</p>
          <DisplayBookRating rating={userReview.rating} />
        </div>
      </div>
    </div>
  );
}

export default ReviewCards;
