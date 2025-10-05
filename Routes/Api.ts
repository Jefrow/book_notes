import type { BookData } from "../src/types";

async function fetchBookData(title: string, author: string) {
  const bookSearch = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title
  )}&author=${encodeURIComponent(author)}`;

  const res = await fetch(bookSearch);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getWorksData(title: string, author: string) {
  const data = await fetchBookData(title, author);

  const workKey = data.docs[0].key;

  const bookSummary = `https://openlibrary.org${workKey}.json`;

  const res = await fetch(bookSummary);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getCoverUrl(title: string, author: string) {
  try {
    const data = await fetchBookData(title, author);

    if (data.docs && data.docs.length > 0) {
      const book = data?.docs?.[0];
      if (!book) return null;

      if (book.isbn?.length > 0)
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      if (book.cover_i)
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    }

    return null;
  } catch (err) {
    console.error("Error fetching cover URL: ", err);
    return null;
  }
}

export async function getBookSummary(title: string, author: string) {
  try {
    const workData = await getWorksData(title, author);

    const desc = workData.description;
    if (typeof desc === "string") return desc;
    if (desc && typeof desc === "object" && "value" in desc) return desc.value;
    return null;
  } catch (err) {
    console.error("Error fetching book summary: ", err);
    return null;
  }
}

export async function getBooks() {
  const res = await fetch("/api/books");
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createReview(review: {
  user_id: number;
  book_id: number;
  review_text: string;
  rating: number;
}) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Failed to create review");
  return res.json();
}

export async function createBookData(bookData: BookData) {
  const res = await fetch("/api/books/full", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) throw new Error("Failed to create new book data.");
  return res.json();
}

export async function getUserReviews(user_id: number) {
  const res = await fetch(`/api/users/${user_id}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch book reviews");
  return res.json();
}
