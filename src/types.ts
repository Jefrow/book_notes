export type Book = {
  book_id: number;
  book_title: string;
  author_id: number;
  book_cover_url?: string | null;
  book_summary?: string | null;
};

export type User = {
  user_id: number;
  user_email: string;
  password: string;
};

export type BookFormData = {
  titleInput: string;
  authorInput: string;
  ratingInput: number;
  reviewInput: string;
};

export type BookData = {
  author_name: string;
  book_title: string;
  book_cover_url?: string | null;
  book_summary?: string | null;
  user_id: number;
  review_text: string;
  rating: number;
};

export type UserReviewData = {
  userReview: {
    book_cover_url: string;
    book_title: string;
    author_name: string;
    book_summary: string;
    review_text: string;
    rating: number;
  };
};

export type BookCardsData = {
  book: {
    book_title: string;
    book_cover_url: string;
    author_name: string;
  };
};

export type PublicUser = Omit<User, "password">;
export type NewUser = PublicUser | null;
