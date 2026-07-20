import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapPicker from "../component/map";


const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

const [successData, setSuccessData] = useState({
  userName: "",
  complaintId: "",
  referenceNo: "",
});

  // ── STATE ──
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState("");

  // File state
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // ── FILE CHANGE ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

 const getLocationName = async (
  latitude: number,
  longitude: number
) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    return res.data.display_name;
  } catch (error) {
    console.log(error);
    return "";
  }
};






  // ── SUBMIT ──
  const handleSubmit = async (): Promise<void> => {
    try {
      if (!category || !title || !description || !location) {
        alert("Please fill all required fields");
        return;
      }
  
const phoneRegex = /^07\d{8}$/;

if (!phoneRegex.test(phone)) {
  setPhoneError("Please enter a valid Sri Lankan phone number.");
  return;
}

setPhoneError("");
      
      const formData = new FormData();

      formData.append("category", category);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
      formData.append("location_name", locationName);
      formData.append("phone", phone);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      console.log("Location Name being sent:", locationName);
    const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/complaints`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);
console.log("SUCCESS RESPONSE:", response.data);

     setSuccessData({
  userName: response.data.userName,
  complaintId: response.data.complaintId,
  referenceNo: response.data.referenceNo,
});
setShowSuccessModal(true);

      
    }catch (err: unknown) {

  if (axios.isAxiosError(err)) {

    console.log("FULL ERROR:", err);

    if (err.response) {
      console.log("Backend Response:");
console.log(err.response.data);
console.log(err.response.data.message);
      console.log("Status:", err.response.status);

      alert(
        err.response.data.message || "Backend Error"
      );

    } else if (err.request) {

      console.log("No response received:", err.request);

      alert("Server not responding");

    } else {

      console.log("Axios Error:", err.message);

      alert(err.message);
    }

  } else {

    console.log(err);

    alert("Unknown error occurred");
  }
}};

  // ── CANCEL ──
  const handleCancel = (): void => {
    navigate(-1);
  };

  const copyReferenceNumber = () => {
  navigator.clipboard.writeText(successData.referenceNo);
  alert("Reference Number Copied!");
};
return (
    <>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background: #f0f5f0;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 900px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        h1 {
          margin-bottom: 10px;
          color: #1a6b3c;
        }

        p {
          color: #666;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        /* ───────── PRIORITY SECTION ───────── */

.priority-group {
  display: flex;
  gap: 14px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.priority-btn {
  flex: 1;
  min-width: 120px;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 14px 18px;

  border-radius: 14px;
  border: 1.5px solid transparent;

  background: #ffffff;

  cursor: pointer;

  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;

  transition: all 0.25s ease;

  box-shadow:
    0 2px 6px rgba(15, 23, 42, 0.04),
    0 8px 18px rgba(15, 23, 42, 0.04);
}

/* Hover Effect */
.priority-btn:hover {
  transform: translateY(-2px);
}

/* Active Click */
.priority-btn:active {
  transform: scale(0.98);
}

/* Priority Dot */
.priority-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* LOW */
.priority-btn.low {
  color: #047857;
  border-color: #bbf7d0;
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
}

.priority-btn.low .priority-dot {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.45);
}

.priority-btn.low:hover {
  border-color: #10b981;
  box-shadow:
    0 4px 10px rgba(16, 185, 129, 0.12),
    0 12px 24px rgba(16, 185, 129, 0.12);
}

.priority-btn.low.sel {
  border-color: #10b981;
  background: linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%);
  box-shadow:
    0 0 0 4px rgba(16, 185, 129, 0.15),
    0 10px 24px rgba(16, 185, 129, 0.2);
}

/* MEDIUM */
.priority-btn.med {
  color: #b45309;
  border-color: #fde68a;
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
}

.priority-btn.med .priority-dot {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.45);
}

.priority-btn.med:hover {
  border-color: #f59e0b;
  box-shadow:
    0 4px 10px rgba(245, 158, 11, 0.12),
    0 12px 24px rgba(245, 158, 11, 0.12);
}

.priority-btn.med.sel {
  border-color: #f59e0b;
  background: linear-gradient(180deg, #fde68a 0%, #fcd34d 100%);
  box-shadow:
    0 0 0 4px rgba(245, 158, 11, 0.15),
    0 10px 24px rgba(245, 158, 11, 0.2);
}

/* HIGH */
.priority-btn.high {
  color: #b91c1c;
  border-color: #fecaca;
  background: linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%);
}

.priority-btn.high .priority-dot {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.45);
}

.priority-btn.high:hover {
  border-color: #ef4444;
  box-shadow:
    0 4px 10px rgba(239, 68, 68, 0.12),
    0 12px 24px rgba(239, 68, 68, 0.12);
}

.priority-btn.high.sel {
  border-color: #ef4444;
  background: linear-gradient(180deg, #fecaca 0%, #fca5a5 100%);
  box-shadow:
    0 0 0 4px rgba(239, 68, 68, 0.15),
    0 10px 24px rgba(239, 68, 68, 0.2);
}

/* Selected Priority Text */
.priority-status {
  margin-top: 14px;
  padding: 10px 14px;

  border-radius: 10px;

  background: #f8fafc;
  border: 1px solid #e2e8f0;

  font-size: 13px;
  color: #475569;

  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.priority-status strong {
  color: #0f172a;
  font-weight: 700;
  ;
}
        .file-box {
          border: 2px dashed #ccc;
          padding: 30px;
          text-align: center;
          border-radius: 10px;
          cursor: pointer;
          background: #fafafa;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: bold;
        }

        .cancel-btn {
          background: #ddd;
        }

        .submit-btn {
          background: #1a6b3c;
          color: white;
        }

        .submit-btn:hover {
          background: #14532d;
        }
          
        /* popup */
        .modal-overlay {
   position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

.success-modal {
  background: #f8f8f8;

  width: 600px;
  max-width: 90%;

  padding: 40px;

  border-radius: 30px;

  border: 12px solid #013317;

  text-align: center;

  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.success-modal h2 {
  color: #166534;
  margin-bottom: 30px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  
}
  .btnnn{
  color: white;
  background: #166534;
  border: 2px solid #166534;
  margin-right: 10px;
  
  }
      `}</style>

      <div className="container">
        <h1>Submit Complaint</h1>
        <p>
          Report a community issue to your village officer (Grama Niladhari)
        </p>

        {/* CATEGORY */}
        <div className="form-group">
          <label>Category </label>

          <select
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCategory(e.target.value)
            }
          >
            <option value="">Select category</option>
            <option>Roads & Infrastructure</option>
            <option>Waste Management</option>
            <option>Street Lighting</option>
            <option>Water & Drainage</option>
            <option>Public Safety</option>
            <option>Noise Pollution</option>
            <option>Environmental Issue</option>
            <option>Other</option>
          </select>
        </div>

    

              
        

        {/* TITLE */}
        <div className="form-group">
          <label>Complaint Title </label>

          <input
            type="text"
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description </label>

          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>

    {/* LOCATION */}
<MapPicker
  setLocation={async (loc: any) => {
    setLocation(loc);

    const name = await getLocationName(loc.lat, loc.lng);

    setLocationName(name);

    console.log("Location Name:", name);
  }}
/>

{location && (
  <div style={{ marginTop: "10px" }}>
    <strong>Selected Location:</strong>
    <br />
    {locationName}
    <br />
  </div>
)}
        {/* PHONE */}
        <div className="form-group">
          <label>Phone Number</label>

          <input
  type="tel"
  placeholder="0712345678"
  value={phone}
  maxLength={10}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);

    if (phoneError) {
      setPhoneError("");
    }
  }}
/>

{phoneError && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "13px",
      marginTop: "6px",
      fontWeight: "500",
    }}
  >
    {phoneError}
  </p>
)}
        </div>


        

        {/* FILE */}
        <div className="form-group">
          <label>Attach Image / PDF</label>

          <div className="file-box">
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
            />

            {fileName && (
              <p style={{ marginTop: "10px", color: "green" }}>
                Selected File: {fileName}
              </p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>

          <button className="submit-btn" onClick={handleSubmit}>
            Submit Complaint
          </button>
        </div>
      </div>
      {showSuccessModal && (
  <div className="modal-overlay">
    <div className="success-modal">

      <h2>Complaint Submitted Successfully</h2>

      <p><strong>Name:</strong> {successData.userName}</p>

      <p><strong>Complaint ID:</strong> {successData.complaintId}</p>

      <p><strong>Reference No:</strong> {successData.referenceNo}</p>

      <button className="btnnn" onClick={copyReferenceNumber}>
        Copy Reference Number
      </button>

      <button className="btnnn" onClick={() => setShowSuccessModal(false)}>
        Close
      </button>

    </div>
  </div>
)}
    </>
  );
};

export default SubmitComplaint;