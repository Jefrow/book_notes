export async function fetchCoverUrl(
  title: string,
  author: string
): Promise<string | null> {
  const bookSearch = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title
  )}&author=${encodeURIComponent(author)}`;

  try {
    const res = await fetch(bookSearch);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    console.log("book data: ", data);
    console.log("first doc:", data?.docs?.[0]);
    console.log("cover_id", data?.docs?.[0]?.cover_i);

    if (data.docs && data.docs.length > 0) {
      const book = data?.docs?.[0];
      if (!book) return null;

      if (book.isbn?.length > 0) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      } else if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }
    }

    return null;
  } catch (err) {
    console.error("Error fetching cover URL: ", err);
    return null;
  }
}

export async function getBooks() {
  const res = await fetch("/api/books");
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createBook(book: {
  title: string;
  author: string;
  rating: number;
  cover_url?: string | null;
}) {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

export async function getReviews() {
  const res = await fetch("/api/reviews");
  if (!res.ok) throw new Error("Failed to fetch book reviews");
  return res.json();
}
