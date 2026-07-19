import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  status: string;
  role: string;

  total_complaints: number;
  resolved: number;
  pending: number;
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  /* FETCH USERS */

  const fetchUsers = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`
      );

      setUsers(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  /* FILTER USERS */

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  /* OPEN EDIT MODAL */

  const openModal = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  /* UPDATE STATUS */

  const updateUser = async () => {

  if (!selectedUser) return;

  try {

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/${selectedUser.user_id}`,
      {
        status: selectedUser.status,
      }
    );

    alert("User updated successfully");

    console.log(res.data);

    setShowModal(false);

    fetchUsers();

  } catch (error: any) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to update user"
    );
  }
};

  /* DELETE USER */

 const deleteUser = async () => {

  if (!selectedUser) return;

  try {

    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/users/${selectedUser.user_id}`
    );

    alert("User deleted successfully");

    console.log(res.data);

    setShowDeleteModal(false);
    setShowModal(false);

    fetchUsers();

  } catch (error: any) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to delete user"
    );
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

.edit-btn{
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

.modal{
width:500px;
background:#f5f5f0;
padding:30px;
border-radius:25px;
position:relative;
z-index:1001;
max-height:90vh;
overflow-y:auto;
}

.modal h2{
text-align:center;
color:#0b5d13;
margin-bottom:25px;
}

.detail{
margin:12px 0 5px;
font-size:17px;
}

.detail span{
font-weight:bold;
margin-right:10px;
}

select{
width:200px;
padding:10px;
border-radius:8px;
margin-top:5px;
}

.modal-buttons{
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

.delete-top{
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

.delete-modal{
width:400px;
background:#f5f5f0;
padding:35px 30px;
border-radius:22px;
text-align:center;
position:relative;
z-index:3000;
}

.delete-modal h3{
font-size:32px;
color:black;
margin-bottom:35px;
line-height:1.3;
}

.delete-actions{
display:flex;
justify-content:center;
gap:30px;
}

.confirm-btn,
.cancel-btn{
border:none;
padding:12px 35px;
border-radius:10px;
font-size:17px;
color:white;
cursor:pointer;
}

.confirm-btn{
background:red;
}
`}
</style>
      <div className="manage-page">

        {/* SIDEBAR */}

        <div className="sidebar">
          <h1>Complaint Core</h1>
          <p>Administration Panel</p>

          <ul>
  <li onClick={() => navigate("/adminDash")}>Dashboard</li>

  <li className="active">Manage Users</li>

  <li onClick={() => navigate("/manageComplaint")}>
    Manage Complaint
  </li>

  <li onClick={() => navigate("/manageReview")}>Manage Review</li>

  <li onClick={() => navigate("/hotspot")}>
    🗺️ Hotspot Map
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

        {/* CONTENT */}

        <div className="main-content">

          <h1>Manage Community Users</h1>

          <p className="subtitle">
            Oversee system access and manage users.
          </p>

          {/* SEARCH */}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER BUTTONS */}

          <div className="filter-buttons">
            <button>All Users</button>
            <button>Citizens</button>
            <button>Admin</button>
            <button>Active Users</button>
            <button>Blocked Users</button>
          </div>

          {/* TABLE */}
          <div className="table-container">
          <table>

            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.user_id}>

                  <td>{user.user_id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openModal(user)}
                    >
                      Edit
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}

      {showModal && selectedUser && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="delete-top"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>

            <h2>Edit User</h2>

            <div className="detail">
              <span>Name:</span>
              {selectedUser.full_name}
            </div>

            <div className="detail">
              <span>Email:</span>
              {selectedUser.email}
            </div>

            <div className="detail">
              <span>Role:</span>
              {selectedUser.role}
            </div>

            {/* <div className="detail">

              <span>Status:</span>

              <select
                value={selectedUser.status}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div> */}

            <br />

            <div className="detail">
              <span>Total Complaints:</span>
              {selectedUser.total_complaints}
            </div>

            <div className="detail">
              <span>Resolved:</span>
              {selectedUser.resolved}
            </div>

            <div className="detail">
              <span>Pending:</span>
              {selectedUser.pending}
            </div>

            <div className="modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={updateUser}
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {showDeleteModal && (

        <div className="modal-overlay">

          <div className="delete-modal">

            <h3>
              Are you sure do you want to delete this account?
            </h3>

            <div className="delete-actions">

              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={deleteUser}
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