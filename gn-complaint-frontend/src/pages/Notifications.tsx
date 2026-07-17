import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Notification {
  notification_id: number;
  full_name: string;
  reference_no: string;
  title: string;
  message: string;
  created_at: string;
}

export default function ManageNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications"
      );

      setNotifications(res.data);
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
transition:.3s;
}

.sidebar ul li:hover{
background:#1d8b24;
}

.sidebar ul li.active{
background:#1d8b24;
}

.main{
flex:1;
padding:40px;
}

.topbar h2{
font-size:48px;
color:#083d14;
margin-bottom:10px;
}

.topbar p{
font-size:18px;
color:#444;
margin-bottom:30px;
}

.notification-container{
display:flex;
flex-direction:column;
gap:20px;
}
.notification-card{
background:white;
padding:25px;
border-radius:15px;
box-shadow:0 3px 10px rgba(0,0,0,.08);
border-left:6px solid #0d5c11;
transition:.3s;
}

.notification-card:hover{
transform:translateY(-3px);
box-shadow:0 8px 18px rgba(0,0,0,.15);
}

.card-header{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:15px;
}

.card-header h3{
color:#0d5c11;
font-size:24px;
margin-bottom:8px;
}

.user-name{
font-size:17px;
color:#555;
}

.date{
font-size:15px;
color:#888;
}

.card-body p{
margin:12px 0;
font-size:17px;
line-height:1.6;
}

.message{
background:#f8f8f8;
padding:15px;
border-radius:10px;
border-left:4px solid #1d8b24;
word-break:break-word;
}

hr{
margin:15px 0;
border:none;
border-top:1px solid #ddd;
}

/* Responsive */

@media(max-width:900px){

.dashboard{
flex-direction:column;
}

.sidebar{
width:100%;
}

.card-header{
flex-direction:column;
gap:10px;
}

.topbar h2{
font-size:36px;
}

}

`}
      </style>

      <div className="dashboard">

        {/* Sidebar */}

        <div className="sidebar">

          <h1>Complaint Core</h1>

          <p>Administration Panel</p>

          <ul>

            <li
              onClick={() => navigate("/adminDash")}
            >
              Dashboard
            </li>

            <li
              onClick={() => navigate("/manageUser")}
            >
              Manage Users
            </li>

            <li
              onClick={() => navigate("/manageComplaint")}
            >
              Manage Complaint
            </li>

            <li
              onClick={() => navigate("/manageReview")}
            >
              Manage Review
            </li>

            <li
              className="active"
              onClick={() => navigate("/manageNotifications")}
            >
              Notifications
            </li>

            <li>
              Settings
            </li>

          </ul>

        </div>

        {/* Main Content */}

        <main className="main">

          <div className="topbar">

            <h2>Notification History</h2>

            <p>
              View all notification emails sent by the system.
            </p>

          </div>

         <div className="notification-container">

  {notifications.length === 0 ? (

    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
        fontSize: "18px",
        color: "#555",
        boxShadow: "0 3px 10px rgba(0,0,0,.08)"
      }}
    >
      No notifications found.
    </div>

  ) : (

    notifications.map((notification) => (

      <div
        key={notification.notification_id}
        className="notification-card"
      >

        <div className="card-header">

          <div>

            <h3>{notification.title}</h3>

            <p className="user-name">
              👤 {notification.full_name}
            </p>

          </div>

          <span className="date">
            {new Date(notification.created_at).toLocaleString()}
          </span>

        </div>

        <hr />

        <div className="card-body">

          <p>
            <strong>Reference No :</strong>{" "}
            {notification.reference_no}
          </p>

          <p className="message">
            {notification.message}
          </p>

        </div>

      </div>

    ))

  )}

</div>

</main>

</div>
</>
);
}