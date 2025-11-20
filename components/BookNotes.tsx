import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navigation";
import AddBook from "./books/AddBooks";
import LogIn from "./auth/LogInForm";
import Register from "./auth/Register";
import Library from "./library/Library";
import UserLibrary from "./library/UserLibrary";
import UserReviews from "./reviews/UserReviews";
import BookDetail from "./books/BookDetail";
import Protected from "./auth/Protected";

function BookNotes() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="p-4 relative top-20">
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/Library" element={<Library />} />
            <Route path="/books/:book_id" element={<BookDetail />} />
            <Route
              path="/UserLibrary"
              element={
                <Protected>
                  <UserLibrary />
                </Protected>
              }
            />
            <Route
              path="/UserReviews"
              element={
                <Protected>
                  <UserReviews />
                </Protected>
              }
            />
            <Route
              path="/AddBook"
              element={
                <Protected>
                  <AddBook />
                </Protected>
              }
            />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default BookNotes;
