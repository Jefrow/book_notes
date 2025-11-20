import BookCards from "../books/BookCards";
import { useEffect, useState } from "react";
import { getBookshelf } from "../../Routes/Api";
import type { BookshelfBook } from "../../src/types";

type FilterType =
  | "all"
  | "added"
  | "favorites"
  | "reading"
  | "read"
  | "want_to_read";

function UserLibrary() {
  const [userBooks, setUserBooks] = useState<BookshelfBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookshelfBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const fetchBookshelf = async () => {
    try {
      const data = await getBookshelf();
      setUserBooks(data);
    } catch (error) {
      // Silently handle error - user will see empty state
      setUserBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchBookshelf();
    return () => ac.abort();
  }, []);

  useEffect(() => {
    let filtered = userBooks;

    switch (activeFilter) {
      case "added":
        filtered = userBooks.filter((book) => book.added_by_me);
        break;
      case "favorites":
        filtered = userBooks.filter((book) => book.is_favorite);
        break;
      case "reading":
        filtered = userBooks.filter((book) => book.read_status === "reading");
        break;
      case "read":
        filtered = userBooks.filter((book) => book.read_status === "read");
        break;
      case "want_to_read":
        filtered = userBooks.filter(
          (book) => book.read_status === "want_to_read"
        );
        break;
      default:
        filtered = userBooks;
    }

    setFilteredBooks(filtered);
  }, [activeFilter, userBooks]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col w-5/6 max-w-[1200px] h-full m-auto px-4">
      <h1 className="m-auto py-10">My Bookshelf</h1>

      {/* Filter Tabs - File Folder Style */}
      <div className="flex justify-end gap-1 mb-0">
        {[
          { key: "all", label: "All" },
          { key: "favorites", label: "Favorites" },
          { key: "reading", label: "Reading" },
          { key: "read", label: "Read" },
          { key: "want_to_read", label: "Want to Read" },
          { key: "added", label: "Added by Me" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key as FilterType)}
            className={`
              relative px-4 py-2 text-sm font-medium transition-all
              rounded-t-lg border-t-2 border-x-2
              ${
                activeFilter === key
                  ? "bg-white text-blue-600 border-blue-500 z-10 -mb-px pb-3"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Books Grid Container with border */}
      <div className="border-2 border-gray-300 rounded-lg rounded-tr-none bg-white p-6 min-h-[400px]">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="text-lg font-medium mb-2">No books on your shelf</p>
            <p className="text-sm text-gray-400">
              {activeFilter === "all"
                ? "Add books to your library or favorite books to see them here"
                : activeFilter === "favorites"
                ? "You haven't favorited any books yet"
                : activeFilter === "added"
                ? "You haven't added any books to the library yet"
                : `You don't have any books marked as "${activeFilter.replace("_", " ")}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <BookCards key={index} book={book} onUpdate={fetchBookshelf} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLibrary;
