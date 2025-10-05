import { useState, useEffect } from "react";
import ReviewCards from "./ReviewCards";
import { getUserReviews } from "../../Routes/Api";

function UserReviews() {
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    async function fetchUserReviews() {
      try {
        const rData = await getUserReviews(1);
        setUserReviews(rData);
      } catch (error) {
        console.error("Could not fetct user Reviews:", error);
      }
    }
    fetchUserReviews();
  }, []);

  return (
    <div className="flex flex-col w-5/6 max-w-[1400px] h-full m-auto px-4]">
      <h1 className="text-center m-auto py-10">All My reviews</h1>
      <div className="book-review-container flex flex-col gap-5">
        {userReviews.map((userReview, index) => (
          <ReviewCards key={index} userReview={userReview} />
        ))}
      </div>
    </div>
  );
}

export default UserReviews;
