import { useState } from "react";
import axios from "axios";

function Form() {
  const [formStarted, setFormStarted] = useState(false);
  const [formInfo, setFormInfo] = useState({ title: "", description: "" });
  const [fields, setFields] = useState([]);

  const addField = () => {
  setFields([
    ...fields,
    { id: Date.now(), label: "", type: "TEXT", options: [], required: false },
  ]);
};


  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const addOptionToField = (id, option) => {
    if (!option.trim()) return;
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, options: [...field.options, option] }
          : field
      )
    );
  };

const handleSubmit = async () => {
  try {
    const api_url = import.meta.env.VITE_API_URL
    const formRes = await axios.post(`${api_url}/forms`, formInfo);
    const form_id = formRes.data.data._id;

    const payload = fields
      .filter(field => field.label.trim() !== "") 
      .map(({ label, type, options, required }) => ({
        form_id,
        title: label.trim(),
        type,
        required,
        options: type === "CHECKBOX" ? options : [],
      }));

    await axios.post(`${api_url}/form-fields/bulk`, payload);
    alert("Form and fields created successfully!");
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        {!formStarted ? (
          <button
            onClick={() => {
              setFormStarted(true);
              setFields([{ id: Date.now(), label: "", type: "TEXT", options: [] }]);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Form
          </button>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Form Info</h1>
            <input
              type="text"
              placeholder="Form Title"
              value={formInfo.title}
              onChange={(e) =>
                setFormInfo({ ...formInfo, title: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Form Description"
              value={formInfo.description}
              onChange={(e) =>
                setFormInfo({ ...formInfo, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <h2 className="text-xl font-semibold mt-4">Add Fields</h2>

            {fields.map((field) => (
  <div key={field.id} className="space-y-2 mb-4 border-b pb-4">
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Field label"
        value={field.label}
        onChange={(e) =>
          updateField(field.id, "label", e.target.value)
        }
        className="flex-1 p-2 border rounded"
      />
      <select
        value={field.type}
        onChange={(e) =>
          updateField(field.id, "type", e.target.value)
        }
        className="p-2 border rounded"
      >
        <option value="TEXT">TEXT</option>
        <option value="CHECKBOX">CHECKBOX</option>
      </select>
    </div>

    {field.type === "CHECKBOX" && (
      <div className="space-y-1">
        <p className="text-sm font-medium">Options</p>
        <AddOptionInput fieldId={field.id} onAddOption={addOptionToField} />
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {field.options.map((opt, idx) => (
            <li key={idx}>{opt}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={field.required}
    onChange={(e) =>
      updateField(field.id, "required", e.target.checked)
    }
  />
  <label className="text-sm">Required</label>
</div>

  </div>
))}


            <button
              onClick={addField}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Add Field
            </button>

            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 block w-full mt-4"
            >
              Submit Form and Fields
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 🔧 Component to add options
function AddOptionInput({ fieldId, onAddOption }) {
  const [option, setOption] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        placeholder="Add option"
        className="flex-1 p-2 border rounded"
      />
      <button
        onClick={() => {
          onAddOption(fieldId, option);
          setOption("");
        }}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  );
}

export default Form;
