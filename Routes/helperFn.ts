import { getCoverUrl, getBookSummary, createBookData } from "./Api";
import type { BookFormData, BookData } from "../src/types";

export const fetchBookMetadata = async (title: string, author: string) => {
  const [coverUrl, bookSummary] = await Promise.all([
    getCoverUrl(title, author),
    getBookSummary(title, author),
  ]);
  return { coverUrl, bookSummary };
};

export const saveBookData = async (
  formData: BookFormData
): Promise<{
  newBookData: BookData;
}> => {
  const { titleInput, authorInput, reviewInput, ratingInput } = formData;

  const { coverUrl, bookSummary } = await fetchBookMetadata(
    titleInput,
    authorInput
  );

  const newBookData = await createBookData({
    author_name: authorInput,
    book_title: titleInput,
    book_cover_url: coverUrl ?? null,
    book_summary: bookSummary ?? null,
    user_id: 1,
    review_text: reviewInput,
    rating: ratingInput,
  });

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
