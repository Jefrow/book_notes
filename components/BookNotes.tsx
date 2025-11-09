import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navigation";
import AddBook from "./layout/AddBooks";
import LogIn from "./layout/LogInForm";
import Register from "./layout/Register";
import Library from "./layout/Library";
import UserReviews from "./layout/UserReviews";
import Protected from "./layout/Protected";

function BookNotes() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="p-4 relative top-20">
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/Library" element={<Library />} />
            <Route path="" />
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
