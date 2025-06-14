import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FormResponses = () => {
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
         const api_url = import.meta.env.VITE_API_URL
        const res = await fetch(`${api_url}/forms/data/${id}`);
        const result = await res.json();
        const { data, formTitle, formDescription } = result.data;

        setResponses(data || []);
        setFormTitle(formTitle || "Form");
        setFormDescription(formDescription || "");
      } catch (err) {
        console.error("Error fetching responses:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{formTitle}</h1>
      {formDescription && (
        <p className="text-gray-600 mb-2">{formDescription}</p>
      )}
      <p className="text-gray-700 mb-6">
        Total Responses: <span className="font-semibold">{responses.length}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {responses.map((user) => (
          <div
            key={user._id}
            className="bg-white p-6 shadow rounded-lg border hover:shadow-lg transition duration-200"
          >
            <form className="space-y-4">
              {user?.responses.map((res, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {res.title}
                  </label>

                  {res?.type === "TEXT" ? (
                    <input
                      type="text"
                      value={res?.value}
                      readOnly
                      className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800"
                    />
                  ) : res.type === "CHECKBOX" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="form-checkbox text-blue-600"
                      />
                      <span className="text-gray-700">{res.value}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormResponses;
