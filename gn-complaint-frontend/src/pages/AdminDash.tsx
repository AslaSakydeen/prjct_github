
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDash() {
    const navigate = useNavigate();
    const [totalComplaints, setTotalComplaints] = useState(0);

    const [pendingReview, setPendingReview] = useState(0);

    const [inProgress, setInProgress] = useState(0);

    const [totalUsers, setTotalUsers] = useState(0);
    const [complaints, setComplaints] = useState<any[]>([]);
    useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {

    // FETCH COMPLAINTS
    const complaintsRes = await axios.get(
      "http://localhost:5000/api/complaints"
    );

    const complaintsData = complaintsRes.data;

    // STORE RECENT COMPLAINTS
    setComplaints(complaintsData);

    // TOTAL COMPLAINTS
    setTotalComplaints(complaintsData.length);

    // PENDING REVIEW
    const pending = complaintsData.filter(
      (c: any) =>
        c.status.toLowerCase() === "pending"
    );

    setPendingReview(pending.length);

    // IN PROGRESS
    const progress = complaintsData.filter(
      (c: any) =>
        c.status.toLowerCase() === "in progress"
    );

    setInProgress(progress.length);

    // FETCH USERS
    const usersRes = await axios.get(
      "http://localhost:5000/api/users"
    );

    setTotalUsers(usersRes.data.length);

  } catch (error) {
    console.log(error);
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

.dashboard{
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

.main{
flex:1;
padding:40px;
}

.topbar h2{
font-size:50px;
color:#083d14;
margin-bottom:15px;
}

.topbar p{
color:#1d3b21;
margin-bottom:30px;
font-size:18px;
}

.admin{
display:flex;
align-items:center;
gap:15px;
margin-bottom:30px;
}

.admin-img{
width:55px;
height:55px;
border-radius:50%;
background:#0d5c11;
}

/* STATS */

.stats{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
margin-bottom:30px;
}

.stat-card{
background:white;
padding:20px;
border-radius:15px;
}

.stat-card h3{
color:#444;
margin-bottom:15px;
font-size:18px;
}

.stat-card h1{
font-size:42px;
color:#0d5c11;
}

.progress{
width:100%;
height:8px;
background:#eee;
border-radius:10px;
margin-top:18px;
overflow:hidden;
}

.progress div{
height:100%;
background:#0d5c11;
}

/* TABLE */

.table-section{
background:white;
padding:20px;
border-radius:15px;
overflow-x:auto;
}

.table-header{
margin-bottom:20px;
}

.table-header h2{
font-size:38px;
color:#083d14;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#d9e9da;
padding:14px;
text-align:left;
}

td{
padding:14px;
border-bottom:1px solid #ddd;
}

/* BADGES */

.badge{
padding:8px 14px;
border-radius:20px;
font-size:12px;
font-weight:bold;
display:inline-block;
}

.urgent{
background:#ffd8d8;
color:#d10000;
}

.medium{
background:#fff1cc;
color:#8a6d00;
}

.low{
background:#e4e4e4;
color:#555;
}

.pending{
background:#ffe0b2;
color:#8a4b00;
}

.progress-status{
background:#d4f7da;
color:#007a1e;
}

.resolved{
background:#0d5c11;
color:white;
}





/* RESPONSIVE */

@media(max-width:1100px){

.stats{
grid-template-columns:repeat(2,1fr);
}

}

@media(max-width:800px){

.dashboard{
flex-direction:column;
}

.sidebar{
width:100%;
}

.stats{
grid-template-columns:1fr;
}

}
`}
</style>

      <div className="dashboard">

        {/* SIDEBAR */}

       <div className="sidebar">

<h1>Complaint Core</h1>

<p>Administration Panel</p>

<ul>

<li
className="active"
onClick={() => navigate("/adminDash")}
>
Dashboard
</li>

<li onClick={() => navigate("/manageUser")}>
Manage Users
</li>

<li onClick={() => navigate("/manageComplaint")}>
Manage Complaint
</li>

<li onClick={() => navigate("/manageReview")}>
Manage Review
</li>

<li onClick={() => navigate("/manageNotifications")}>Notification</li>

<li>Settings</li>

</ul>

</div>


        {/* MAIN */}

        <main className="main">

          {/* TOPBAR */}

          <div className="topbar">

            <div>
              <h2>Overview Analysis</h2>
              <p>
                Real-time system monitoring and citizen metrics.
              </p>
            </div>

            

          </div>

          {/* STATS */}

          <div className="stats">

            <div className="stat-card">
              <h3>TOTAL COMPLAINTS</h3>
              <h1>{totalComplaints}</h1>

              <div className="progress">
                <div style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className="stat-card">
              <h3>PENDING</h3>
              <h1>{pendingReview}</h1>

              <div className="progress">
                <div
                  style={{
                    width: "45%",
                    background: "orange",
                  }}
                ></div>
              </div>
            </div>

            <div className="stat-card">
              <h3>IN PROGRESS</h3>
              <h1>{inProgress}</h1>

              <div className="progress">
                <div style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="stat-card">
              <h3>TOTAL USERS</h3>
              <h1>{totalUsers}</h1>

              <div className="progress">
                <div style={{ width: "85%" }}></div>
              </div>
            </div>

          </div>

          {/* TABLE */}

          <div className="table-section">

            <div className="table-header">
              <h2>Recent Complaints</h2>
            </div>

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                 
                  <th>CATEGORY</th>
                  <th>TITLE</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>SUBMITTED</th>
                </tr>

              </thead>

              <tbody>

                {complaints.map((item) => (

                  <tr key={item.complaint_id}>

                    <td>{item.user_id}</td>

                   

                    <td>{item.category}</td>

                    <td>{item.title}</td>

                    <td>

                      <span
                        className={`
                          badge
                          ${
                            item.priority === "High"
                                ? "urgent"
                            : item.priority === "Medium"
                                  ? "medium"
                                : "low"
                          }
                        `}
                      >
                        {item.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`
                          badge
                          ${
                            item.status === "Pending"
                              ? "pending"
                              : item.status === "In Progress"
                              ? "progress-status"
                              : "resolved"
                          }
                        `}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>{new Date(
                       item.complaint_date
                       ).toLocaleDateString()}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


        </main>

      </div>
    </>
  );
}