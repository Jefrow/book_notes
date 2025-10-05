import { useState } from "react";
import StarRating from "./StarRating";
import { toast } from "react-hot-toast";
import { saveBookData } from "../../Routes/helperFn";

function AddBook() {
  const [formData, setFormData] = useState({
    titleInput: "",
    authorInput: "",
    ratingInput: 0,
    reviewInput: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveBookData(formData);

      setFormData({
        titleInput: "",
        authorInput: "",
        ratingInput: 0,
        reviewInput: "",
      });

      toast.success("You added a book!");
    } catch (error) {
      console.log(error);
      toast.error("Could not add book");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-5"
    >
      <h1 className="text-lg/12 text-center font-semibold text-black">
        Add A Book
      </h1>
      {/*Book Title*/}
      <div>
        <label htmlFor="">Book Title:</label>
        <input
          name="titleInput"
          placeholder=""
          value={formData.titleInput}
          onChange={handleChange}
          required
          className="w-full p-2 rounded shadow"
        />
      </div>
      <div>
        <label htmlFor="">Author:</label>
        <input
          name="authorInput"
          placeholder=""
          value={formData.authorInput}
          onChange={handleChange}
          required
          className="w-full p-2 rounded shadow"
        />
      </div>
      <div>
        <label htmlFor="">rating</label>
        <StarRating
          rating={formData.ratingInput}
          onChange={(newRating) =>
            setFormData((prev) => ({ ...prev, ratingInput: newRating }))
          }
        />
      </div>
      <div>
        <label htmlFor="">Book Notes or Review:</label>
        <textarea
          name="reviewInput"
          placeholder=""
          value={formData.reviewInput}
          onChange={handleChange}
          className="w-full p-2 rounded shadow"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-black shadow px-4 py-2 p-4 rounded-lg mx-auto flex justify-center cursor-pointer"
        value="submit"
      >
        Add Book
      </button>
    </form>
  );
}

export default AddBook;
