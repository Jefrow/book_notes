import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 w-full z-100">
      <div className="max-w-4/5 mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold px-3 py-2 text-blue-600 mb-2 sm:mb-0">
          Book Notes
        </h1>
        <ul className="flex w-md sm:justify-end gap-2 sm: gap-4 text-gray-700">
          <li className="p-2">
            <Link
              to="/Library"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Library
            </Link>
          </li>
          <li className="p-2">
            <Link
              to="/MyBooks"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              My Books
            </Link>
          </li>
          <li className="p-2">
            <Link
              to="/BookReview"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              My Reviews
            </Link>
          </li>
          <li className="p-2">
            <Link
              to="/AddBook"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Add Book
            </Link>
          </li>
        </ul>
        <div className="px-4 py-2 bg-blue shadow-md rounded rounded bg-blue-500 text-white">
          <Link
            to="/LogIn"
            className="hover:text-blue-600 transition cursor-pointer"
          >
            LogIn
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
