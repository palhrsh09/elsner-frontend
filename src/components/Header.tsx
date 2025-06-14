import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 shadow-md">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-gray-800 cursor-pointer"
      >
        Form Manager
      </h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Forms
        </button>
        <button
          onClick={() => navigate("/form")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Form
        </button>
      </div>
    </header>
  );
};

export default Header;
