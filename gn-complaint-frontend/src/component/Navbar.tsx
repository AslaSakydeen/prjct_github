import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <Link to="/home">Home</Link>
      <Link to="/complaints">My Complaints</Link>

      <button>Logout</button>
    </div>
  );
}