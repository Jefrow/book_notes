export async function fetchCoverUrl(
  title: string,
  author: string
): Promise<string | null> {
  const query = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title
  )}&author=${encodeURIComponent(author)}`;

  try {
    const res = await fetch(query);
    const data = await res.json();

    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];

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
