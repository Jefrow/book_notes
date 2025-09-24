import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold px-3 py-2 text-blue-600 mb-2 sm:mb-0">
          Book Notes
        </h1>
        <ul className="flex sm:justify-end sm:flex-grow gap-2 sm: gap-4 text-gray-700">
          <li>
            <Link
              to="/Library"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Library
            </Link>
          </li>
          <li>
            <Link
              to="/myBooks"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              My Books
            </Link>
          </li>
          <li>
            <Link
              to="/myReview"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              My Reviews
            </Link>
          </li>
          <li>
            <Link
              to="/addBook"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Add Book
            </Link>
          </li>
          <li>
            <Link
              to="/LogIn"
              className="hover:text-blue-600 transition cursor-pointer"
            >
              LogIn
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
