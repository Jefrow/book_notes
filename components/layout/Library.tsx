import BookCards from "./BookCards";
import { useEffect, useState } from "react";
import { getBooks } from "../../Routes/Api";

function Library() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        console.error("Error Fetching Books:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col  w-5/6 h-full m-auto px-15">
        <h1 className=" m-auto py-10 ">All Books</h1>
        <div className="booksContainer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <BookCards key={index} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}
export default Library;
