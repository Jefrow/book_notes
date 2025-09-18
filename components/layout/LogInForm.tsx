function LogIn() {
  return (
    <form className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-5">
      <h1 className="text-lg/12 text-center front-semibold text-black">
        Log In
      </h1>
      <div>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          name="userName"
          id=""
          className="w-full p-2 rounded shadow"
        />
      </div>
      <div>
        <label htmlFor="User Password">User Password:</label>
        <input
          type="text"
          name="password"
          id=""
          className="w-full p-2 rounded shadow"
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer bg-blue-500 text-black shadow px-4 py-2 p-4 rounded-lg mx-auto flex justify-center"
      >
        LogIn
      </button>
    </form>
  );
}

export default LogIn;
