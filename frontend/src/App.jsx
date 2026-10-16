import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<h1>Espace Client MANASIK</h1>} />
        <Route path="/admin" element={<h1>Dashboard Admin MANASIK</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;