import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function FormPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const api_url = import.meta.env.VITE_API_URL
        const res = await axios.get(`${api_url}/forms/${id}`);
        const form = res.data.data;
        setFormData(form);

        const initialValues = {};
        form.fields.forEach((field) => {
          if (field.type === "CHECKBOX") {
            initialValues[field._id] = [];
          } else {
            initialValues[field._id] = "";
          }
        });
        setFormValues(initialValues);
      } catch (err) {
        console.error("Failed to fetch form", err);
      }
    };

    fetchForm();
  }, [id]);

  const handleChange = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  const handleCheckboxChange = (fieldId, option) => {
    setFormValues((prev) => {
      const current = prev[fieldId] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [fieldId]: updated };
    });

    setErrors((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    formData.fields.forEach((field) => {
      const value = formValues[field._id];
      if (field.required) {
        if (field.type === "TEXT" && !value.trim()) {
          newErrors[field._id] = "This field is required.";
        }

        if (field.type === "CHECKBOX" && (!value || value.length === 0)) {
          newErrors[field._id] = "Please select at least one option.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validate()) return;

  const payload = Object.entries(formValues).flatMap(([fieldId, value]) => {
    if (Array.isArray(value)) {
      return value.map((val) => ({
        field_id: fieldId,
        value: val,
      }));
    } else {
      return [{
        field_id: fieldId,
        value: value,
      }];
    }
  });

  try {
    const api_url = import.meta.env.VITE_API_URL
    const res = await axios.post(`${api_url}/form-fields-data/bulk`, payload);
    console.log("Success:", res.data);
    alert("Form submitted successfully!");
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Failed to submit the form. Check console for error.");
  }
};


  if (!formData) return <div className="p-4">Loading form...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-2">{formData.title}</h1>
        <p className="text-gray-600 mb-4">{formData.description}</p>

        <form className="space-y-4" noValidate>
          {formData.fields.map((field) => (
            <div key={field._id}>
              <label className="block font-semibold mb-1">
                {field.title}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "TEXT" ? (
                <input
                  type="text"
                  value={formValues[field._id] || ""}
                  onChange={(e) => handleChange(field._id, e.target.value)}
                  className={`w-full p-2 border rounded ${errors[field._id] ? "border-red-500" : "border-gray-300"}`}
                />
              ) : (
                <div className="flex flex-col gap-1">
                  {field.options.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formValues[field._id]?.includes(option)}
                        onChange={() => handleCheckboxChange(field._id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {errors[field._id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field._id]}</p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
