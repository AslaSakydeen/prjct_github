import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Complaint from "./pages/SubmitComplaint"; 
import Track from "./pages/Track";
import ReviewsPage from "./pages/ReviewsPage";
import AdminDash from "./pages/AdminDash";
import HowItWorks from "./pages/HowItWorks";
import ManageUser from "./pages/ManageUser";
import AdComplaint from "./pages/ManageComplaint";
import TrackResult from "./pages/TrackResults";
import Navbar from "./pages/Navbar"; 
import ManageReview from "./pages/ManageReview";
import Report from "./pages/Report";
import ManageNotifications from "./pages/Notifications";
import HotspotMap from "./pages/HotspotMap";

export default function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/complaint" element={<Complaint />} />
      <Route path="/track" element={<Track />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/how" element={<HowItWorks />} />
      <Route path="/track/:referenceNumber" element={<TrackResult />}/>
      <Route path="/navbar" element={<Navbar />} />
     

      <Route path="/adminDash" element={<AdminDash />} />
        <Route path="/manageUser" element={<ManageUser />} />
      <Route path="/manageComplaint" element={<AdComplaint />} />
       <Route path="/manageReview" element={<ManageReview />} />
      <Route path="/Report/:id" element={<Report />} />
      <Route path="/manageNotifications" element={<ManageNotifications />} />
      <Route path="/hotspot" element={<HotspotMap />} />
    </Routes>
  );
}