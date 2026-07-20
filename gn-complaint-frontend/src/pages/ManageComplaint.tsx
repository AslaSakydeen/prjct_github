import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Complaint {
   complaint_id: number;
  user_id: number;
  title: string;
  phone: string;
  category: string;
  priority: string;
  location: string;
  description: string;
  image_url: string;
  resolution_proof?: string;
  complaint_date: string;
  status: string;
  admin_response: string;
}

export default function ManageComplaint() {
  const [complaints, setComplaints] = useState<
    Complaint[]
  >([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState("All");

    const navigate = useNavigate();

  // MODAL
  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [status, setStatus] =
    useState("");

  const [adminResponse, setAdminResponse] =
    useState("");

  const [priority, setPriority] =
    useState("");

    const [resolutionProof, setResolutionProof] =
  useState<File | null>(null);

  // DELETE CONFIRM MODAL
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  // FETCH
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints`
      );

      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FILTER
  const filteredComplaints = complaints.filter(
    (complaint) => {
      const matchesSearch =
        complaint.complaint_id
          .toString()
          .includes(search.toLowerCase()) ||
        complaint.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "High Priority"
          ? complaint.priority === "High"
          : complaint.status.toLowerCase() ===
            filter.toLowerCase();

      return matchesSearch && matchesFilter;
    }
  );

 

  // OPEN MODAL
  const openModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);

    setStatus(complaint.status);

    setPriority(complaint.priority || "Not Assigned");

    setAdminResponse(
      complaint.admin_response || ""
    );
  };

  // CLOSE MODAL
  const closeModal = () => {
    setSelectedComplaint(null);
    setShowDeleteConfirm(false);
  };

  // SAVE
 const handleSave = async () => {
  if (!selectedComplaint) return;

  try {
    const formData = new FormData();

    formData.append("status", status);
    formData.append("admin_response",adminResponse);
    formData.append("priority", priority);

    if (resolutionProof) {
      formData.append(
        "resolutionProof",
        resolutionProof
      );
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/complaints/${selectedComplaint.complaint_id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    alert("Complaint Updated");

    fetchComplaints();
    closeModal();

  } catch (err) {
    console.error(err);
    alert("Update Failed");
  }
};

  // DELETE
  const handleDelete = async () => {
  if (!selectedComplaint) return;

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/complaints/${selectedComplaint.complaint_id}`
    );

    console.log(response.data);

    alert("Complaint Deleted Successfully");

    setShowDeleteConfirm(false);
    setSelectedComplaint(null);

    fetchComplaints(); // refresh table

  } catch (err: any) {
    console.log("DELETE ERROR:", err);

    alert(
      err.response?.data?.message || "Delete failed"
    );
  }
};

let lat = 6.9271;
let lng = 79.8612;

if (selectedComplaint?.location) {
  const matches =
    selectedComplaint.location.match(
      /Latitude:\s*([-\d.]+).*Longitude:\s*([-\d.]+)/s
    );

  if (matches) {
    lat = parseFloat(matches[1]);
    lng = parseFloat(matches[2]);
  }
}
  return (
    <>
      <style>
        {`
*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial, Helvetica, sans-serif;
}

.manage-page{
display:flex;
min-height:100vh;
background:#f4f3ef;
}

.sidebar{
width:250px;
background:#003b12;
color:white;
padding:30px 20px;
}

.sidebar h1{
font-size:34px;
margin-bottom:5px;
}

.sidebar p{
margin-bottom:50px;
}

.sidebar ul{
list-style:none;
}

.sidebar ul li{
padding:14px 18px;
margin-bottom:18px;
border-radius:10px;
cursor:pointer;
font-size:18px;
}

.sidebar ul li.active{
background:#1d8b24;
}

.main-content{
flex:1;
padding:40px;
}

.main-content h1{
font-size:50px;
color:#083d14;
margin-bottom:15px;
}

.subtitle{
color:#1d3b21;
margin-bottom:30px;
font-size:18px;
}

.search-box{
background:white;
padding:20px;
border-radius:18px;
display:flex;
gap:15px;
align-items:center;
margin-bottom:20px;
}

.search-box input{
flex:1;
padding:14px;
border-radius:10px;
border:1px solid #b5b5b5;
font-size:16px;
}

.search-box button{
background:#0d5c11;
color:white;
border:none;
padding:14px 30px;
border-radius:10px;
cursor:pointer;
}

.filter-buttons{
display:flex;
gap:15px;
margin-bottom:25px;
flex-wrap:wrap;
}

.filter-buttons button{
background:#0d5c11;
color:white;
border:none;
padding:10px 24px;
border-radius:20px;
cursor:pointer;
}

.table-container{
background:white;
padding:20px;
border-radius:15px;
overflow-x:auto;
}

.table-container table{
width:100%;
border-collapse:collapse;
}

.table-container th{
background:#d9e9da;
padding:14px;
text-align:left;
}

.table-container td{
padding:14px;
border-bottom:1px solid #ddd;
}

.view-btn{
background:#0d5c11;
margin-bottom:10px;
color:white;
border:none;
padding:8px 14px;
border-radius:8px;
cursor:pointer;
}

/* MODAL */

.modal-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.5);
display:flex;
justify-content:center;
align-items:center;
z-index:1000;
}

.modal-box{
width:1100px;
max-width:95vw;
background:#eef2ee;
padding:25px;
border-radius:10px;
max-height:90vh;
overflow-y:auto;
position:relative;
overflow-y:auto;
}

.edit-form{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
margin-top:20px;
}

.form-column{
display:flex;
flex-direction:column;
gap:10px;
}

.form-column label{
font-size:13px;
font-weight:600;
color:#21572b;
}

.form-column input,
.form-column select,
.form-column textarea{
width:100%;
padding:8px;
border:1px solid #d6d6d6;
background:white;
border-radius:3px;
}

.large-textarea{
height:120px;
resize:none;
}

.medium-textarea{
height:80px;
resize:none;
}

.map-box{
height:180px;
border:1px solid #ddd;
overflow:hidden;
background:white;
}

.image-box{
height:180px;
border:1px solid #ddd;
background:white;
display:flex;
align-items:center;
justify-content:center;
overflow:hidden;
}

.complaint-image{
width:100%;
height:100%;
object-fit:cover;
border:none;
}

.no-image{
width:100%;
height:100%;
display:flex;
justify-content:center;
align-items:center;
color:#888;
}

.map-link{
margin-top:5px;
font-size:13px;
text-decoration:underline;
color:#0056b3;
}

.button-group{
display:flex;
justify-content:flex-end;
gap:15px;
margin-top:25px;
}

.cancel-btn,
.save-btn {
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
}

.cancel-btn {
  background: #d9d9d9;
  color: black;
}

.cancel-btn:hover {
  background: #c7c7c7;
}

.save-btn {
  background: #0d5c11;
  color: white;
}

.save-btn:hover {
  background: #0a4a0e;
}

.delete-btn{
position:absolute;
top:20px;
right:20px;
background:#d9534f;
color:white;
border:none;
padding:10px 15px;
border-radius:4px;
cursor:pointer;
}

.confirm-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.45);
display:flex;
justify-content:center;
align-items:center;
z-index:2000;
}

.confirm-box{
width:400px;
background:white;
padding:30px;
border-radius:15px;
text-align:center;
}

.confirm-buttons{
display:flex;
justify-content:center;
gap:20px;
margin-top:20px;
}

.confirm-cancel{
background:#0d7a24;
color:white;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

.confirm-delete{
background:red;
color:white;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

`}
      </style>

      <div className="manage-page">

        <div className="sidebar">

          <h1>Complaint Core</h1>

          <p>Administration Panel</p>

          <ul>
            <li onClick={() => navigate("/adminDash")}>Dashboard</li>

            <li onClick={() => navigate("/manageUser")}>Manage Users</li>

            <li className="active">
              Manage Complaint
            </li>

            <li onClick={() => navigate("/manageReview")}>
              Manage Review
            </li>

            <li onClick={() => navigate("/hotspot")}>
             Hotspot Map
            </li>

            <li>Notification</li>

            <li>Settings</li>

            <li onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}>
              Logout
            </li>
          </ul>

        </div>

        <div className="main-content">

          <h1>
            Manage <br />
            Community Complaints
          </h1>

          <p className="subtitle">
            Oversee system access and manage
            complaints.
          </p>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search by Complaint ID, Category"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            

          </div>

          <div className="filter-buttons">

            <button
              onClick={() => setFilter("All")}
            >
              All
            </button>

            <button
              onClick={() =>
                setFilter("Pending")
              }
            >
              Pending
            </button>

            <button
              onClick={() =>
                setFilter("In progress")
              }
            >
              In progress
            </button>

            <button
              onClick={() =>
                setFilter("Resolved")
              }
            >
              Resolved
            </button>

            <button
              onClick={() =>
                setFilter("High Priority")
              }
            >
              High Priority
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>User ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredComplaints.map(
                  (complaint) => (
                    <tr
                      key={
                        complaint.complaint_id
                      }
                    >

                      <td>
                        {
                          complaint.complaint_id
                        }
                      </td>

                      <td>
                        {complaint.user_id}
                      </td>

                      <td>
                        {complaint.title}
                      </td>

                      <td>
                        {complaint.category}
                      </td>

                      <td>
                        {complaint.priority || "Not Assigned"}
                      </td>

                      <td>
                        {new Date(
                          complaint.complaint_date
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {complaint.status}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            openModal(
                              complaint
                            )
                          }
                        >
                          View/Edit
                        </button><br></br>
                         <button
className="view-btn"
onClick={()=>navigate(
`/Report/${complaint.complaint_id}`
)}

>
Generate Report

</button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MAIN MODAL */}

      {selectedComplaint && (

        <div className="modal-overlay">

          <div className="modal-box">

           

            <h2>
              View / Edit Complaints
            </h2>

          <div className="edit-form">

  {/* LEFT SIDE */}
  <div className="form-column">

    <label>User ID :</label>
    <input
      type="text"
      value={selectedComplaint.user_id}
      readOnly
    />

    <label>Phone :</label>
    <input
      type="text"
      value={selectedComplaint.phone}
      readOnly
    />


 <label>Priority :</label>

<select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option value="Not Assigned">Not Assigned</option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

    <label>Description :</label>

    <textarea
      value={selectedComplaint.description}
      readOnly
      className="large-textarea"
    />

    <label>Status :</label>

    <select
      value={status}
      onChange={(e) =>
        setStatus(e.target.value)
      }
    >
      <option value="Pending">
        Pending
      </option>

      <option value="In progress">
        In progress
      </option>

      <option value="Resolved">
        Resolved
      </option>
    </select>

    <label>Admin Comment :</label>

    <textarea
      value={adminResponse}
      onChange={(e) =>
        setAdminResponse(e.target.value)
      }
      className="medium-textarea"
      placeholder="Enter comment..."
    />

  </div>

  {/* RIGHT SIDE */}
  <div className="form-column">

    <label>Complaint ID :</label>
    <input
      type="text"
      value={selectedComplaint.complaint_id}
      readOnly
    />

    <label>Category :</label>
    <input
      type="text"
      value={selectedComplaint.category}
      readOnly
    />

    <label>Location :</label>

    <div className="map-box">

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{
          height: "180px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} />
      </MapContainer>

    </div>

    <a
      href={`https://www.google.com/maps?q=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="map-link"
    >
      View on Google Maps
    </a>

    <label>Complaint Image :</label>

    <div className="image-box">

      {selectedComplaint.image_url ? (
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${selectedComplaint.image_url}`}
          alt="Complaint"
          className="complaint-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("prjctgithub-production")) {
              target.src = `https://prjctgithub-production.up.railway.app/uploads/${selectedComplaint.image_url}`;
            }
          }}
        />
      ) : (
        <div className="no-image">
          No Image
        </div>
      )}

    </div>

    {status === "Resolved" && (
      <>
        <label>
          Resolution Proof :
        </label>

       <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      setResolutionProof(e.target.files[0]);
    }
  }}
/>
      </>
    )}

  </div>

</div>

  <button
              className="delete-btn"
              onClick={() =>
                setShowDeleteConfirm(true)
              }
            >
              Delete
            </button>

<div className="button-group">
         

  <button
    className="cancel-btn"
    onClick={closeModal}
  >
    Cancel
  </button>

  <button
    className="save-btn"
    onClick={handleSave}
  >
    Save Changes
  </button>

</div>

          </div>

        </div>
      )}

{showDeleteConfirm && (

  <div className="confirm-overlay">

    <div className="confirm-box">

      <h3>
        Are you sure do you want to
        delete this complaint?
      </h3>

      <div className="confirm-buttons">

        <button
          className="confirm-cancel"
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >
          Cancel
        </button>

        <button
          className="confirm-delete"
          onClick={handleDelete}
        >
          Confirm
        </button>

      </div>

    </div>

  </div>
)}

    </>
  );
}