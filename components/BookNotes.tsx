import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import Navbar from "./layout/Navigation";
import AddBook from "./layout/AddBooks";

function BookNotes() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" />
            <Route path="" />
            <Route path="" />
            <Route path="/AddBook" element={<AddBook />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default BookNotes;
