function BookReview() {
  return (
    <form>
      <label htmlFor="reviewBox">Leave A Review</label>
      <input type="text" className="reviewBox" />
      <button type="submit">Post</button>
    </form>
  );
}

export default BookReview;
