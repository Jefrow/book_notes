export type Book = {
  book_id: number;
  book_title: string;
  author_id: number;
  book_cover_url?: string | null;
  book_summary?: string | null;
  isbn?: string | null;
  data_source?: string | null;
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
  isbn?: string | null;
  data_source?: string | null;
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
    book_id: number;
    book_title: string;
    book_cover_url: string;
    author_name: string;
    is_favorite?: boolean | null;
    read_status?: string | null;
  };
};

export type BookshelfBook = {
  book_id: number;
  book_title: string;
  book_cover_url: string;
  author_name: string;
  is_favorite: boolean | null;
  read_status: "read" | "reading" | "want_to_read" | null;
  added_to_shelf_at: string | null;
  added_by_me?: boolean;
};

export type BookReview = {
  review_text: string;
  rating: number;
  created_at: string;
  user_email: string;
};

export type PublicUser = Omit<User, "password">;
export type NewUser = PublicUser | null;
