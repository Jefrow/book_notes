import { useNavigate } from "react-router-dom";
import type { BookCardsData } from "../../src/types";
import FavoriteButton from "../ui/FavoriteButton";
import ReadStatusDropdown from "../ui/ReadStatusDropdown";
import { toggleFavorite, updateReadStatus } from "../../Routes/Api";

interface BookCardsProps extends BookCardsData {
  onUpdate?: () => void | Promise<void>;
}

function BookCards({ book, onUpdate }: BookCardsProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/books/${book.book_id}`);
  };

  const handleFavorite = async (bookId: number) => {
    await toggleFavorite(bookId);
    if (onUpdate) await onUpdate();
  };

  const handleStatusChange = async (bookId: number, status: string) => {
    await updateReadStatus(bookId, status);
    if (onUpdate) await onUpdate();
  };

  return (
    <div
      className="bookCardContainer w-full mx-auto px-6 py-8 flex flex-col bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="bookImage aspect-5/8 bg-transparent rounded">
        <img
          className="h-full w-full object-fit"
          src={book.book_cover_url || "../src/assets/no-cover.png"}
          alt="book image"
        />
      </div>
      <div className="flex w-full flex-col gap-2 w-50 mx-auto py-2">
        <p className="italic">{book.book_title}</p>
        <p className="font-semibold">{book.author_name}</p>

        <div className="flex items-center justify-between mt-2">
          <FavoriteButton
            bookId={book.book_id}
            initialFavorite={book.is_favorite || false}
            onToggle={handleFavorite}
          />
          <ReadStatusDropdown
            bookId={book.book_id}
            initialStatus={book.read_status || null}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
export default BookCards;
