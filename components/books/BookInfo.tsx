import DisplayBookRating from "../shared/DisplayBookRating";

interface bookProps {
  book: {
    title: string;
    author: string;
    rating: number;
    cover_url: string;
    summary: string;
  };
}

function BookInfo({ book }: bookProps) {
  return (
    <>
      <div className="bookInfoContainer">
        <div className="bookImgContainer">
          <img src={book.cover_url || "../src/assets/no-cover.png"} />
        </div>
        <div className="bookInfoWrapper">
          <p className="italic">{book.title}</p>
          <p className="font-semibold">{book.author}</p>
          <DisplayBookRating rating={book.rating} />
        </div>
      </div>
    </>
  );
}

export default BookInfo;
