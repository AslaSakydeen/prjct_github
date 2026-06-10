import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Complaint from "./pages/SubmitComplaint";
import ReviewsPage from "./pages/ReviewsPage";
import AdminDash from "./pages/AdminDash";
import HowItWorks from "./pages/HowItWorks";
import ManageUser from "./pages/ManageUser";
import AdComplaint from "./pages/ManageComplaint";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/complaint" element={<Complaint />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/adminDash" element={<AdminDash />} />
      <Route path="/how" element={<HowItWorks />} />
      <Route path="/manageUser" element={<ManageUser />} />
      <Route path="/manageComplaint" element={<AdComplaint />} />
    </Routes>
  );
}