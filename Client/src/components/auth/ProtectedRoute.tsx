
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredUserType?: UserType | UserType[];
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requiredUserType
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If auth is required and user is not logged in, redirect to auth page
  if (requireAuth && !user) {
    return <Navigate to="/auth" />;
  }

  // If user is logged in but route requires specific user type
  if (user && requiredUserType) {
    const allowedTypes = Array.isArray(requiredUserType) ? requiredUserType : [requiredUserType];
    
    if (!allowedTypes.includes(user.userType)) {
      // Redirect to dashboard if user type doesn't match
      return <Navigate to="/dashboard" />;
    }
  }

  // If auth is not required and user is logged in, redirect to dashboard
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
