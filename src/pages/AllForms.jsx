import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ALLForm = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://localhost:8000/form/v1/forms");
        const result = await res.json();
        setForms(result.data || []);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {forms.map((form) => (
        <div
          key={form._id}
          className="border p-4 rounded-lg shadow bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">{form.title}</h2>
          <p className="text-gray-600 mt-2">{form.description}</p>
          <p className="text-sm text-gray-500 mt-4">
            Created At: {new Date(form.created_at).toLocaleString()}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => navigate(`/form/view/${form._id}`)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              View
            </button>
            <button
              onClick={() => navigate(`/form/${form._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Fill
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ALLForm;
