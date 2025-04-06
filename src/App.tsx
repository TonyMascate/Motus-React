import { Routes, Route } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import Home from "./pages/Home";
import { Login, Register } from "./components/AuthForm";
import MotusGame from "./pages/MotusGame";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/game" element={<MotusGame />} />
      </Route>
    </Routes>
  );
};

export default App;
