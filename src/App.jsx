// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import Form from "./pages/Form";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
