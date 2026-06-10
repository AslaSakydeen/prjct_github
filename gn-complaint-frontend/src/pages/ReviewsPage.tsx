import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

type Review = {
  id: number;
  ref: string;
  category: string;
  rating: number;
  date: string;
  body: string;
  adminReply: string | null;
};

type Complaint = {
  value: string;
  label: string;
};

type StarInputProps = {
  rating: number;
  onChange: (value: number) => void;
};

type StarDisplayProps = {
  rating: number;
  size?: number;
};

type ReviewCardProps = {
  review: Review;
};

const theme = {
  green950: "#052e16",
  green900: "#14532d",
  green800: "#166534",
  green700: "#15803d",
  green600: "#16a34a",
  green500: "#22c55e",
  green100: "#dcfce7",
  green50: "#f0fdf4",
  sand: "#faf8f3",
  ink: "#0c1a0e",
  inkSoft: "#374151",
  inkMuted: "#6b7280",
  white: "#ffffff",
  accent: "#f59e0b",
  accentLt: "#fef3c7",
  teal: "#0f766e",
  tealDark: "#115e59",
  tealLight: "#f0fdfa",
};

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: theme.sand,
    fontFamily: "'Segoe UI', sans-serif",
  },

  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },

  card: {
    background: theme.white,
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "1rem",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "1rem",
  },

  button: {
    background: theme.teal,
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  starsRow: {
    display: "flex",
    gap: "4px",
    marginBottom: "1rem",
  },
};

const initialReviews: Review[] = [
  {
    id: 1,
    ref: "#CC-2024-006",
    category: "Garbage Collection",
    rating: 5,
    date: "30 Apr 2026",
    body: "Very satisfied with the service.",
    adminReply: "Thank you for your feedback.",
  },
];

const complaints: Complaint[] = [
  { value: "CC-2024-007", label: "CC-2024-007 — Pothole Repair" },
  { value: "CC-2024-008", label: "CC-2024-008 — Tree Trimming" },
];



 
   function StarInput({ rating, onChange }: StarInputProps) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          onClick={() => onChange(v)}
          onMouseEnter={() => setHover(v)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: "28px",
            cursor: "pointer",
            color: v <= (hover || rating) ? theme.accent : "#d1d5db",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
  
function StarDisplay({ rating, size = 16 }: StarDisplayProps) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          style={{
            fontSize: `${size}px`,
            color: v <= rating ? theme.accent : "#d1d5db",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div style={styles.card}>
      <StarDisplay rating={review.rating} />

      <h3>
        {review.ref} — {review.category}
      </h3>

      <p>{review.body}</p>

      {review.adminReply && (
        <div>
          <strong>Admin Reply:</strong>
          <p>{review.adminReply}</p>
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    if (!selectedComplaint || !reviewText.trim()) {
      alert("Please fill all fields");
      return;
    }

    const complaint = complaints.find(
      (c) => c.value === selectedComplaint
    );

    if (!complaint) return;

    const parts = complaint.label.split(" — ");

    const newReview: Review = {
      id: Date.now(),
      ref: `#${parts[0]}`,
      category: parts[1],
      rating,
      date: new Date().toLocaleDateString(),
      body: reviewText,
      adminReply: null,
    };

    setReviews([newReview, ...reviews]);

    setSelectedComplaint("");
    setReviewText("");
    setRating(4);
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div className="nav-wrap">
        <nav className="navbar">
          <div
            className="brand"
            onClick={() => navigate("/")}
          >
            <div className="brand-mark">CC</div>
            <span className="brand-name">
              Complaint<span>Core</span>
            </span>
          </div>

          <ul className="nav-center">
            <li>
              <span onClick={() => navigate("/")}>Home</span>
            </li>

            <li>
              <span onClick={() => navigate("/how")}>
                How it Works
              </span>
            </li>

            <li>
              <span onClick={() => navigate("/complaints")}>
                My Complaints
              </span>
            </li>

            <li className="active">
              <span onClick={() => navigate("/reviews")}>
                Reviews
              </span>
            </li>
          </ul>

          <div className="nav-right">
            <button
              className="btn-nav-submit"
              onClick={() => navigate("/complaint")}
            >
              Submit Complaint
            </button>

            <button
              className="nav-logout"
              onClick={() => navigate("/")}
            >
              Logout
            </button>

            <div className="avatar">JD</div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Write a Review</h2>

          <select
            style={styles.select}
            value={selectedComplaint}
            onChange={(e) =>
              setSelectedComplaint(e.target.value)
            }
          >
            <option value="">Select Complaint</option>

            {complaints.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <StarInput
            rating={rating}
            onChange={setRating}
          />

          <textarea
            style={styles.textarea}
            value={reviewText}
            onChange={(e) =>
              setReviewText(e.target.value)
            }
            placeholder="Write your review..."
          />

          <button
            style={styles.button}
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>

        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}
      </div>
    </div>
  );
}