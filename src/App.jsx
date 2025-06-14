// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import Form from "./pages/Form";
import ALLForm from "./pages/AllForms";
import MainLayout from "./components/MainLayout";
import FormResponses from "./pages/FormResponse";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <ALLForm />
            </MainLayout>
          }
        />
        <Route
          path="/form"
          element={
            <MainLayout>
              <Form />
            </MainLayout>
          }
        />
        <Route
          path="/form/:id"
          element={
            <MainLayout>
              <FormPage />
            </MainLayout>
          }
        />
         <Route
          path="/form/view/:id"
          element={
            <MainLayout>
              <FormResponses />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
