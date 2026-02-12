import React from "react";
import { useAuth } from "../auth/AuthContext";
import "./styles/ProfileDetailsComponent.css";

const ProfileDetailsComponent: React.FC = () => {
  const { name, initials } = useAuth();
  const avatarUrl = "https://picsum.photos/200"; // Placeholder avatar image
  const isPro = true;
  const email = "user@example.com";
  const joinDate = "January 2023";
  const location = "New York, USA";
  const role = "Administrator";

  return (
    <div className="user-card">
      {/* 1. The Blue Header */}
      <div className="card-header"></div>

      {/* 2. The Content Body */}
      <div className="card-body">
        {/* 3. The Avatar (Overlapping) */}
        <div className="avatar-wrapper">
          <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            className="avatar-image"
          />
          {isPro && <span className="badge">PRO</span>}
        </div>

        {/* User Text Details */}
        <h2 className="user-name">{name}</h2>
        <p className="user-email">{email}</p>

        {/* Info Grid */}
        <div className="details-list">
          <div className="detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">{joinDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role</span>
            <span className="detail-value">{role}</span>
          </div>
        </div>

        <button className="view-btn">View Full Profile</button>
      </div>
    </div>
  );
};

export default ProfileDetailsComponent;
