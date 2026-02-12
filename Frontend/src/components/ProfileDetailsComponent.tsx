import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/ProfileDetailsComponent.css";

// importing react icons
import { CiGrid41 } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";

interface ProfileDetailsComponentProps {
  setShowProfileDetails: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: {
    email: string;
    joinDate: string;
    location: string;
    role: string;
    userAvatarUrl: string;
  },
    onLogout: () => void;
}

// will implement a getProfileDetails api call later to fetch user details

const ProfileDetailsComponent: React.FC<ProfileDetailsComponentProps> = ({ setShowProfileDetails, userInfo, onLogout }) => {

  const navigate = useNavigate();

  const { name, initials } = useAuth();
  const userAvatarUrl = userInfo.userAvatarUrl;
  const isPro = true;
  const email = userInfo.email;
  const joinDate = userInfo.joinDate;
  const location = userInfo.location;
  const role = userInfo.role;

  return (
    <div className="user-card">
      {/* Blue Header */}
      <div className="card-header"></div>

      {/* Content */}
      <div className="card-body">
        {/* Avatar Section */}
        <div className="avatar-wrapper">
          {userAvatarUrl ? <img src={userAvatarUrl} alt={name ? name : "user Name"} className="avatar-image" /> : initials}
          {isPro && <span className="pro-badge">PRO</span>}
        </div>

        {/* Basic Info */}
        <h2 className="user-name">{name}</h2>
        <p className="user-email">{email}</p>

        {/* --- Navigation Grid --- */}
        <div className="nav-grid">
          <div className="nav-item" title="Dashboard" onClick={() => {navigate("/projects");
            setShowProfileDetails(false);
          }}>
            {/* Dashboard Icon */}
            <CiGrid41 className="nav-icon"/>
            <span>Dashboard</span>
          </div>

          <div className="nav-item">
            {/* user edit Icon */}
            <LiaUserEditSolid className="nav-icon"/>
            <span>Edit Profile</span>
          </div>

          <div className="nav-item" title="Home" onClick={() => {navigate("/"); setShowProfileDetails(false);}}>
            {/* Home Icon */}
            <IoHomeOutline className="nav-icon"/>
            <span>Home</span>
          </div>

          <div className="nav-item" onClick={onLogout}>
            {/* Logout Icon */}
            <AiOutlineLogout className="nav-icon" />
            <span>Logout</span>
          </div>
        </div>

        {/* Details List */}
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

        {/* Footer Action */}
        {/* <button className="view-btn">View Full Profile</button> */}
      </div>
    </div>
  );
};

export default ProfileDetailsComponent;
