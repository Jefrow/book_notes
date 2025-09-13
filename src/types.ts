export type Book = {
  id: number;
  title: string;
  author: string;
  review: string;
  cover_url: string;
  created_by: number;
  rating: number;
};

export type User = {
  id: number;
  userName: string;
  email: string;
  password: string;
};
