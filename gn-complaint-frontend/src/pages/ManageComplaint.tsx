import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Complaint {
  complaint_id: number;
  user_id: number;
  title: string;
  phone: string;
  category: string;
  priority: string;
  location: string;
  description: string;
  complaint_image: string;
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
        "http://localhost:5000/api/complaints"
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
    await axios.put(
      `http://localhost:5000/api/complaints/${selectedComplaint.complaint_id}`,
      {
        status,
        admin_response: adminResponse,
      }
    );

    alert("Complaint Updated");

    fetchComplaints();

    setSelectedComplaint(null);

  } catch (err) {
    console.log(err);
  }
};

  // DELETE
  const handleDelete = async () => {
  if (!selectedComplaint) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/complaints/${selectedComplaint.complaint_id}`
    );

    alert("Complaint Deleted");

    setShowDeleteConfirm(false);

    setSelectedComplaint(null);

    fetchComplaints();

  } catch (err) {
    console.log(err);
  }
};

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
width:500px;
background:#f5f5f0;
padding:30px;
border-radius:25px;
position:relative;
z-index:1001;
max-height:90vh;
overflow-y:auto;
}

.modal-box h2{
text-align:center;
color:#0b5d13;
margin-bottom:25px;
}

.details p{
margin:12px 0 5px;
}

.description-box,
.response-box{
width:100%;
height:90px;
border-radius:10px;
border:1px solid #ccc;
padding:10px;
resize:none;
}

.complaint-image{
width:180px;
height:140px;
object-fit:cover;
border-radius:10px;
border:1px solid #ccc;
}

.no-image{
width:180px;
height:140px;
border:1px solid #ccc;
border-radius:10px;
display:flex;
justify-content:center;
align-items:center;
color:gray;
background:white;
}

select{
width:200px;
padding:10px;
border-radius:8px;
margin-top:5px;
}

.button-group{
display:flex;
justify-content:space-between;
margin-top:25px;
}

.cancel-btn,
.save-btn{
border:none;
padding:10px 30px;
border-radius:10px;
cursor:pointer;
color:white;
font-size:16px;
}

.cancel-btn{
background:#0d5c11;
}

.save-btn{
background:#0d5c11;
}

.delete-btn{
position:absolute;
top:20px;
right:20px;
background:red;
color:white;
border:none;
padding:8px 16px;
border-radius:10px;
cursor:pointer;
}

/* DELETE CONFIRM MODAL */

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
background:#f5f5f0;
padding:35px 30px;
border-radius:22px;
text-align:center;
position:relative;
z-index:3000;
}

.confirm-box h3{
font-size:32px;
color:black;
margin-bottom:35px;
line-height:1.3;
}

.confirm-buttons{
display:flex;
justify-content:center;
gap:30px;
}

.confirm-cancel,
.confirm-delete{
border:none;
padding:12px 35px;
border-radius:10px;
font-size:17px;
color:white;
cursor:pointer;
}

.confirm-cancel{
background:#0d7a24;
}

.confirm-delete{
background:red;
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

            <li>Manage Review</li>

            <li>Notification</li>

            <li>Settings</li>
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
                        {complaint.priority}
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

            <button
              className="delete-btn"
              onClick={() =>
                setShowDeleteConfirm(true)
              }
            >
              Delete
            </button>

            <h2>
              View / Edit Complaints
            </h2>

            <div className="details">

              <p>
                <strong>
                  Complaint ID :
                </strong>{" "}
                {
                  selectedComplaint.complaint_id
                }
              </p>

              <p>
                <strong>User ID :</strong>{" "}
                {selectedComplaint.user_id}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {selectedComplaint.phone}
              </p>

              <p>
                <strong>
                  Category :
                </strong>{" "}
                {
                  selectedComplaint.category
                }
              </p>

              <p>
                <strong>
                  Priority :
                </strong>{" "}
                {
                  selectedComplaint.priority
                }
              </p>

              <p>
                <strong>
                  Location :
                </strong>{" "}
                {
                  selectedComplaint.location
                }
              </p>

              <p>
                <strong>
                  Description :
                </strong>
              </p>

              <textarea
                readOnly
                value={
                  selectedComplaint.description
                }
                className="description-box"
              />

              <p>
                <strong>
                  Complaint Image :
                </strong>
              </p>

              {selectedComplaint.complaint_image ? (

                <img
                  src={
                    selectedComplaint.complaint_image
                  }
                  alt="Complaint"
                  className="complaint-image"
                />

              ) : (

                <div className="no-image">
                  No Image
                </div>

              )}

              <p>
                <strong>Status :</strong>
              </p>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
              >
                <option>
                  Pending
                </option>

                <option>
                  In progress
                </option>

                <option>
                  Resolved
                </option>

              </select>

              <p>
                <strong>
                  Admin Response :
                </strong>
              </p>

              <textarea
                value={adminResponse}
                onChange={(e) =>
                  setAdminResponse(
                    e.target.value
                  )
                }
                className="response-box"
              />

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
                  Save
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

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