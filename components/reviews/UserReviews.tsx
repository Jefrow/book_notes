import { useState, useEffect } from "react";
import ReviewCards from "./ReviewCards";
import { getMyReviews } from "../../Routes/Api";

function UserReviews() {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getMyReviews();
        setUserReviews(data.reviews || []);
      } catch (error) {
        if (error) {
          console.error("Could not fetch user Reviews:", error);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  if (loading) return null;

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
