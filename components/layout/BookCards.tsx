import type { BookCardsData } from "../../src/types";

function BookCards({ book }: BookCardsData) {
  return (
    <div className="bookCardContainer w-full mx-auto px-6 py-8 flex flex-col bg-white shadow rounded-lg p-4">
      <div className="bookImage aspect-5/8 bg-transparent rounded">
        <img
          className="h-full w-full object-fit"
          src={book.book_cover_url || "../src/assets/no-cover.png"}
          alt="book image"
        />
      </div>
      <div className="flex  w-full flex-col gap-2 w-50 mx-auto py-2">
        <p className="italic">{book.book_title}</p>
        <p className="font-semibold">{book.author_name}</p>
      </div>
    </div>
  );
}
export default BookCards;
