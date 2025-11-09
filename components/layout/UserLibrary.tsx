import BookCards from "./BookCards";
import { useEffect, useState } from "react";
import { getMyBooks } from "../../Routes/Api";

function UserLibrary() {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-5/6 max-w-[1200px] h-full m-auto px-4">
      <h1 className="m-auto py-10">My books</h1>
      <div className="grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {BookUser.map((book, index) => (
          <BookCards key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default UserLibrary;
