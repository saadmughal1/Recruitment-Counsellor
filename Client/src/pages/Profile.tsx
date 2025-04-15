
import { useAuth } from "@/contexts/AuthContext";
import ApplicantProfile from "./ApplicantProfile";
import RecruiterProfile from "./RecruiterProfile";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return user.userType === "applicant" ? <ApplicantProfile /> : <RecruiterProfile />;
};

export default Profile;
