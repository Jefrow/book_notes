import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import Navbar from "./layout/Navigation";
import AddBook from "./layout/AddBooks";
import LogIn from "./layout/LogInForm";
import Register from "./layout/Register";
import Library from "./layout/Library";
import UserReviews from "./layout/UserReviews";

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
            <Route path="/BookReview" element={<UserReviews />} />
            <Route path="/AddBook" element={<AddBook />} />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default BookNotes;
