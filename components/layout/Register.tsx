import { useState } from "react";
import { Link } from "react-router-dom";
import { postUser } from "../../Routes/Api";

function Register() {
  const [formData, setFormData] = useState({
    user_email: " ",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await postUser({
        user_email: formData.user_email,
        password: formData.password,
      });
      setFormData({
        user_email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`${name}:${value}`);
  };

  return (
    <form
      className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-5"
      onSubmit={handleSubmit}
    >
      <h1 className="text-lg/12 text-center front-semibold text-black">
        Register
      </h1>
      <div>
        <label htmlFor="user_email">email:</label>
        <input
          type="text"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded shadow"
        />
      </div>
      <div>
        <label htmlFor="userPassword">password:</label>
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded shadow"
        />
      </div>
      <button
        type="submit"
        name=""
        className="cursor-pointer bg-blue-500 text-black shadow px-4 py-2 rounded-lg mx-auto flex justify-center"
      >
        Register
      </button>
      <p className="text-center">
        Already have an account?{" "}
        <Link
          className="text-blue-600 underline hover:text-blue-800 ml-1"
          to="/LogIn"
        >
          Log In
        </Link>
      </p>
    </form>
  );
}

export default Register;
