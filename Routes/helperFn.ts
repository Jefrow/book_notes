import { getCoverUrl, getBookSummary, getISBN, createBookData } from "./Api";
import type { BookFormData } from "../src/types";

export const fetchBookMetadata = async (title: string, author: string) => {
  const [coverUrl, bookSummary, isbn] = await Promise.all([
    getCoverUrl(title, author),
    getBookSummary(title, author),
    getISBN(title, author),
  ]);
  return { coverUrl, bookSummary, isbn };
};

export const saveBookData = async (
  formData: BookFormData
): Promise<any> => {
  const { titleInput, authorInput, reviewInput, ratingInput } = formData;

  const { coverUrl, bookSummary, isbn } = await fetchBookMetadata(
    titleInput,
    authorInput
  );

  const newBookData = await createBookData({
    author_name: authorInput,
    book_title: titleInput,
    book_cover_url: coverUrl ?? null,
    book_summary: bookSummary ?? null,
    isbn: isbn ?? null,
    data_source: isbn ? 'openlibrary' : 'user',
    review_text: reviewInput,
    rating: ratingInput,
  } as any);

  return { newBookData };
};

export async function parseBody(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
